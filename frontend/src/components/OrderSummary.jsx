import { motion } from "framer-motion";
import { useCartStore } from "../store/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";

const stripePromise = loadStripe("pk_test_51Qxp4aRw30Wzg9xhqp2uhi5maamxmFK0kAbHwFfkMoDIvRLjpY36ygYfIKMh8wYsel7qA4ZFZsUhtZ8RzGCURJUk002kxK71PI");

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2); // $100.00 last 2 digits after decimal
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	const handlePayment = async () => {
		const stripe = await stripePromise;
		const res = await axios.post("/payments/create-checkout-session", {
			products: cart,
			couponCode: coupon ? coupon.code : null,
		});

		const session = res.data;
		const result = await stripe.redirectToCheckout({
			sessionId: session.id,
		});

		if (result.error) {
			console.error("Error:", result.error);
		}
	};
  
  return (
    <motion.div
      className='space-y-4 rounded-lg border border-gray-600 bg-gray-800 p-4 shadow-2xl sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
    >
      <p className='text-xl font-semibold text-yellow-400/90'>Order summary</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">Original price</dt>
            <dd className="text-base font-medium text-white">${formattedSubtotal}</dd>
          </dl>

          {savings > 0 && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Savings</dt>
							<dd className='text-base font-medium text-yellow-400/90'>-${formattedSavings}</dd>
						</dl>
					)}

          {coupon && isCouponApplied && (
						<dl className='flex items-center justify-between gap-4'>
							<dt className='text-base font-normal text-gray-300'>Coupon ({coupon.code})</dt>
							<dd className='text-base font-medium text-yellow-400/90'>-{coupon.discountPercentage}%</dd>
						</dl>
					)}

          <dl className='flex items-center justify-between gap-4 border-t border-gray-600 pt-2'>
						<dt className='text-base font-bold text-white'>Total</dt>
						<dd className='text-base font-bold text-yellow-400'>${formattedTotal}</dd>
					</dl>
        </div>

        <motion.button
					className='flex w-full items-center justify-center rounded-lg bg-yellow-500/90 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-yellow-400 focus:outline-none focus:ring-4 focus:ring-gray-200'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handlePayment}
				>
					Proceed to Checkout
				</motion.button>
        
        <div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-yellow-400 underline hover:text-yellow-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>

      </div>

    </motion.div>
  );
};

export default OrderSummary;