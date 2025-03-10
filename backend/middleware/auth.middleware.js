import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // check for the token from the cookies
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized - No access token provided" });
    }
    
    try {
      // if it exists, try to decode it
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      // find the user from the userId that the token had 
      const user = await User.findById(decoded.userId).select("-password");

      if(!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // put the token in the req
    req.user = user;

    next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized - Access token Expired" });
      }
      throw error;
    }

  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res.status(401).json({ message: "Unauthorized - Invalid access token" });
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};