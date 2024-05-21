import mongoose from "mongoose";
import dotenv from "dotenv";

import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";

const app = express();

dotenv.config();
const DB_URI = process.env.DB_URI;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_URI)
  .then(() => {
  app.listen(5500, () => {
  console.log("Server is running. Use our API on port: 5500");
  });
  console.log("Database connection successful")
})
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
