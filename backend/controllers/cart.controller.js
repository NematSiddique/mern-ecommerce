import Product from "../models/product.model.js";

// get all product in user's cart
export const getCartProducts = async (req, res) => {
  try {
    // check for IDs in user's cartItems with which Product can be found
    const products = await Product.find({ _id: {$in: req.user.cartItems} });
     
    // products don't have quantity in user.model so add quantity for each product
    const cartItems = products.map((product) => {
      // find the same pro duuct in user's cart
      const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
      // return product info with quantity added
      return { 
        ...product.toJSON(), // all product details
        quantity: item.quantity // add how many of this product user has
      };
    });
    res.json(cartItems);

  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// add product to the cart
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // check if the product is laready in the cart
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1; // if yes, add one more
    } else {
      user.cartItems.push(productId); // if no, add it to the cartItems
    }

    await user.save();
    res.json(user.cartItems);

  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// remove products from the cart
export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItems = []; // if no ID, clear the whole cart
    } else {
      // remove just the product with the given ID
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in removeAllFromCart controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// update how many of a product is in the cart
export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params; // get product ID from the URL
    const { quantity } = req.body;
    const user = req.user;
    
    // find the product in the cart
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      // if new quantity is 0
      if (quantity === 0) { 
        user.cartItems = user.cartItems.filter((item) => item.id !== productId); // remove product from the cart
        await user.save();
        return res.json(user.cartItems);
      }
      // otherwise
      existingItem.quantity = quantity; // update new quantity
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not found" }); // if product isn't in the cart
    }

  } catch (error) {
    console.log("Error in updateQuantity controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};