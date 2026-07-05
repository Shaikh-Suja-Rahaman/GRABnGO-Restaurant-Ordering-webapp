import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
  try {
    const token = jwt.sign({ id: "68f7a1e146ed195f97707bf6" }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const response = await axios.get('http://localhost:10000/api/orders/myorders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("Status:", response.status);
    const order = response.data.find(o => o._id.toString().endsWith('0ed731'));
    if (order) {
      console.log(JSON.stringify(order.orderItems, null, 2));
    } else {
      console.log("Order not found");
    }
  } catch(e) {
    console.log("Error:", e.response ? e.response.data : e.message);
  }
}
test();
