import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

// data for the cart
export const getAnalyticsData = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  // aggregation pipeline
  const salesData = await Order.aggregate([ // takes in array
    {
      $group: {
        _id: null, // it groups all documents together
        totalSales: {$sum:1},
        totalRevenue: {$sum:"$totalAmount"},
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesData[0] || { totalSales:0, totalRevenue:0 };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    // aggregating the orders
    const dailySalesData = await Order.aggregate([
      // filters
      {
        // it will give all the orders over last week
        $match: { // field 
          createdAt: {
            $gte: startDate, // if greater than startDate
            $lte: endDate, // if less than endDate
          },
        },
      },
      {
        // grouping them together
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
          }},
          sales: {$sum:1}, // summing up all the orders from each day
          revenue: {$sum:"$totalAmount"},
        },
      },
      {
        $sort: {_id:1}
      },
    ]);
    // example of dailySalesData
    // [{
    //    _id: "2024-08-18"
    //    sales: 12
    //    revenue: 1450.75
    // }]
  
    const dateArray = getDatesInRange(startDate, endDate);
    
    return dateArray.map((date) => {
      const foundDate = dailySalesData.find((item) => item._id === date);
      
      return {
        date,
        sales: foundDate?.sales || 0,
        revenue: foundDate?.revenue || 0,
      };
    });
  } catch (error) {
    throw error;
  }
};

// function to get the dates in range
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
