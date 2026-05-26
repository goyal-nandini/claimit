import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import env from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";

env.config();
const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL,
  ],
  credentials: true,
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/claims", claimRoutes);
app.use('/api', itemRoutes);

app.get("/", (req, res) => {
    res.send("claimit API is running");
});

const startServer = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected");

        app.listen(process.env.PORT || 5000, () => {
            console.log(`server running on port ${process.env.PORT || 5000}`); 
        });
    } catch(err) {
        console.log("failed to start server", err.message);
        process.exit(1);
    }
};

startServer();