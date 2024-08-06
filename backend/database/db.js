import mongoose from "mongoose";
import { ENV_VARIABLES } from '../config/envVariables.js';

const MONGODB_URL = ENV_VARIABLES.MONGODB_URL;
mongoose.connect(MONGODB_URL, {
    dbName: 'TweetStream'
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to database');
});

db.on('disconnected', () => {
    console.log('database disconnected');
});

db.on('error', (err) => {
    console.log('Error connecting to database: ', err);
});

export default db;