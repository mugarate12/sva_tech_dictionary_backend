import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoDBPassword = process.env.MONGO_DB_PASSWORD;
const uri = `mongodb+srv://svaTech:${mongoDBPassword}@svatech.r91vcev.mongodb.net/?retryWrites=true&w=majority`;

async function connectDatabase() {
  await mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB', err));
}

export async function disconnectDatabase() {
  await mongoose.connection.close()
    .then(() => console.log('Disconnected from MongoDB'))
    .catch((err) => console.log('Error disconnecting from MongoDB', err));
}

export default connectDatabase;
