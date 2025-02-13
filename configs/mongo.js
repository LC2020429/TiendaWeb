"use strict";

import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    mongoose.connection.on("error", () => {
      console.log("MongoDB | could not be connect to MongoDB");
      mongoose.disconnect();
    });
    mongoose.connection.on("connecting", () => {
      console.log("MongoDB | try connecting");
    });
    mongoose.connection.on("connected", () => {
      console.log("MongoDB | connected to MongoDB");
    });
    mongoose.connection.on("open", () => {
      console.log("MongoDB | Connnected to DataBase");
    });
    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB | reconnected to MongoDB");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB | disconnected to MongoDB");
    });

    await mongoose.connect(process.env.URI_MONGO, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 30,
    });
  } catch (err) {
    console.log(`Database connection failed: ${err}`);
  }
};
