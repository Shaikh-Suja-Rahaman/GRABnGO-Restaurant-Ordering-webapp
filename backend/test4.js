import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/Order.js';
import MenuItem from './models/MenuItem.js'; // to avoid error

dotenv.config();

const req = { user: { _id: "68f7a1e146ed195f97707bf6" } };
const res = {
  status: (code) => {
    console.log('Status code:', code);
    return res;
  },
  json: (data) => {
    // console log exactly what Express sends back!
    console.log("JSON response:");
    data.forEach(order => {
      if (order.orderItems.length > 0) {
        console.log(JSON.stringify(order.orderItems[0], null, 2));
      }
    });
  }
};

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.menuItem', 'name');
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error inside controller mockup:", error);
  }
  mongoose.disconnect();
});
