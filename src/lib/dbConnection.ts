import mongoose from "mongoose";

interface connectionObjectType {
  isConnected?: number;
}
const connection: connectionObjectType = {};

export const dbConnection = async (): Promise<void> => {
  try {
    if (connection.isConnected) {
      console.log("DB already connected");
      return;
    }

    const db = await mongoose.connect(process.env.MONGO_URI!);

    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected");
  } catch (error) {
    console.log("error to connect to db: ", error);
    process.exit(1);
  }
};
