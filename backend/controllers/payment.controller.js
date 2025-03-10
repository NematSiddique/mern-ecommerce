import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";


export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    let totalAmount = 0;

    // lineItems (is an array) is a fancy way for products
    const lineItems = products.map((product) => {
      // stripe wants the amount in the format of cents 
      // cents => $10 * 100 = $1000
      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });
    
    // create a session
    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({ 
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      // if coupon is in the DB
      if (coupon) {
        totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100); // will make it in the cent format
      }
    }

    // creating session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon 
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });
    // create a coupon for next purchase if user is buying something worth $200 and more
    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id);
    }
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });

  } catch (error) {
    console.error("Error processing checkout session:", error);
    res.status(500).json({ message: "Error processing checkout session", error: error.message });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    // user will send a sessionId
    const { sessionId } = req.body;
    // getting sessionId from stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // checking if the payment was successfully done
    if (session.payment_status === "paid") {
      // checking coupon
      // if it has been used then deactivate (or update) it
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate({
          code: session.metadata.couponCode,
          userId: session.metadata.userId,
        }, {
          isActive: false,
        });
      }
      // create a new order because payment is done
      // JSON.parse to convert metadata into js object
      const products = JSON.parse(session.metadata.products);
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100, // convert from cents to dollars
        stripeSessionId: sessionId,
      });

      await newOrder.save();

      res.status(200).json({
        success: true,
        message: "Payment successful, order created, and coupon deactivetaed if used.",
        orderId: newOrder._id,
      });
    }
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    res.status(500).json({ message: "Error processing successful checkout", error: error.message });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({ 
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
};

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString().substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
  });

  await newCoupon.save();

  return newCoupon;
};