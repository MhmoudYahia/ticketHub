import mongoose from 'mongoose';
import { DatabaseConnectionError } from './errors/database-connection-error';
import { app } from './app';


const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('connected to mongodb');
  } catch (error) {
    console.error(error);
    return new DatabaseConnectionError();
  }

  app.listen(3000, () => {
    console.log('listening on port 3000!');
  });
};

start();
