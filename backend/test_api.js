import mongoose from 'mongoose';
import express from 'express';
import { getMyOrders } from './controllers/orderController.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected");
  
  const req = {
    user: { _id: "68f7a1e146ed195f97707bf6" } // The user ID from the user's log
  };
  
  const res = {
    status: (code) => {
      console.log('Status:', code);
      return res;
    },
    json: (data) => {
      const order = data.find(o => o._id.toString().endsWith('0ed731'));
      if (order) {
        console.log(JSON.stringify(order.orderItems, null, 2));
      } else {
        console.log("Order not found in getMyOrders");
      }
      mongoose.disconnect();
    }
  };
  
  await getMyOrders(req, res);
}).catch(console.error);
