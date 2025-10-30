import dotenv from 'dotenv';
dotenv.config();

export default {
  HOST: process.env.HOST || 'no encontré variable de entorno',
  PORT: process.env.PORT || 'no encontré variable de entorno',
  API_URL: process.env.API_URL || 'no encontré variable de entorno',
  CONNECTION_STRING:
    process.env.CONNECTION_STRING || 'no encontré variable de entorno',
};
