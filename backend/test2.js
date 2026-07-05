import mongoose from 'mongoose';
import Order from './models/Order.js';
import MenuItem from './models/MenuItem.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected");
  const orders = await Order.find({ orderItems: { $not: { $size: 0 } } }).sort({ createdAt: -1 }).limit(1).populate('orderItems.menuItem', 'name');
  console.log(JSON.stringify(orders[0].orderItems[0], null, 2));
  mongoose.disconnect();
}).catch(console.error);
