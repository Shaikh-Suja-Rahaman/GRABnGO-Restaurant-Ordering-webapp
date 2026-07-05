import mongoose from 'mongoose';
import Order from './models/Order.js';
import MenuItem from './models/MenuItem.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Connected to MongoDB for migration.");
  
  try {
    const orders = await Order.find();
    let updatedCount = 0;
    
    for (const order of orders) {
      let modified = false;
      for (const item of order.orderItems) {
        if (!item.name && item.menuItem) {
          const menuItem = await MenuItem.findById(item.menuItem);
          if (menuItem) {
            item.name = menuItem.name;
            modified = true;
          }
        }
      }
      
      if (modified) {
        await order.save();
        updatedCount++;
      }
    }
    
    console.log(`Migration complete. Updated ${updatedCount} orders.`);
  } catch (error) {
    console.error("Migration error:", error);
  }
  
  mongoose.disconnect();
}).catch(console.error);
