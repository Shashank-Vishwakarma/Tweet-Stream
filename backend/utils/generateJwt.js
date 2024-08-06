import jwt from "jsonwebtoken";
import { ENV_VARIABLES } from '../config/envVariables.js';

export const generateJwt = (payload) => {
    return jwt.sign({ payload }, ENV_VARIABLES.JWT_SECRET, { expiresIn: '15d' });
};