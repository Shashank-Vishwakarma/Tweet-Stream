import express from 'express';
import { protectRoutewithJwt } from '../middlewares/protectRouteWithJwt.js';
import { deleteNotifications, getNotifications } from '../controllers/notificationController.js';

const notificationRoutes = express.Router();

notificationRoutes.get('/', protectRoutewithJwt, getNotifications);
notificationRoutes.delete('/', protectRoutewithJwt, deleteNotifications);

export default notificationRoutes;