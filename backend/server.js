import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import AuthRoutes from './routes/authRoutes.js'
import MenuRoutes from './routes/menuRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import favoritesRoutes from './routes/favoritesRoutes.js';
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config()

const app = express()
const PORT = process.env.PORT || 10000; // Change 5001 to 10000

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'https://kiosks-restaurant-ordering-webapp.vercel.app',
      'https://grabngo-webapp.vercel.app',
    ];
    // Allow any localhost origin (any port) for local development
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin) || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("MongoDB connected successfully")

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => console.log("MongoDB connection error", err))

app.get('/', (req, res)=>{ //test route
  res.status(200).send("API CALL TO TEST STUFF")
})

app.use('/api/auth', AuthRoutes) //send all the auth related tasks to this route
app.use('/api/menu', MenuRoutes)
app.use('/api/orders', orderRoutes);

app.use('/api/favorites', favoritesRoutes)
app.use("/api/payments", paymentRoutes);