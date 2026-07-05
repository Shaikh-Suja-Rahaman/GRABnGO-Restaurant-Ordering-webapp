import mongoose from 'mongoose';
import Order from './models/Order.js';
import MenuItem from './models/MenuItem.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected");
  const orders = await Order.find().populate('orderItems.menuItem', 'name');
  const specificOrder = orders.find(o => o._id.toString().endsWith('0ed731'));
  if (specificOrder) {
    console.log(JSON.stringify(specificOrder.orderItems, null, 2));
  } else {
    console.log("Order not found");
  }
  mongoose.disconnect();
}).catch(console.error);
