/*import express from 'express';
import cors from 'cors';
import 'dotenv/config.js'; 
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';

const app=express()

await connectCloudinary();

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())



app.get('/',(req,res)=>res.send('Server is Live'))

//app.use(requireAuth())
app.use('/api/ai',aiRouter)
app.use('/api/user',userRouter)
app.use("/api/payment", paymentRouter);

const PORT =process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log('Server is running on port',PORT);
})*/

import express from 'express';
import cors from 'cors';
import 'dotenv/config.js';
import { clerkMiddleware } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import paymentRouter from './routes/paymentRoutes.js';

const app = express();

// Connect to Cloudinary before starting server
await connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware()); // Clerk authentication middleware

// Test route
app.get('/', (req, res) => res.send('Server is Live'));

// Routes
// If you want certain routes protected, you can use requireAuth() individually
app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);
app.use('/api/payment', paymentRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

