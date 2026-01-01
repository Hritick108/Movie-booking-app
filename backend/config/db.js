import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://hritickchawla666_db_user:moviebook123@cluster0.bziwq0z.mongodb.net/MovieBook"
    )
    .then(() => console.log("DB_CONNECTED"));
};
