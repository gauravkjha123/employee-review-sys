import pkg from './package.json' assert { type: 'json' };
import { getOsEnv,normalizePort ,toBool } from './lib/env/utils.js';
import { config } from 'dotenv';

/**
 * Load .env file
 */
config({
    path: `.env.${
      process.env.NODE_ENV === 'production' ? 'production' : 'local'
    }`,
  });
  
/**
 * Environment variables
 */
export const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    app: {
        name: getOsEnv('APP_NAME'),
        version: (pkg ).version,
        description: (pkg).description,
        host: getOsEnv('APP_HOST'),
        schema: getOsEnv('APP_SCHEMA'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        banner: toBool(getOsEnv('APP_BANNER')),
    },
    email: {
        serviceName: getOsEnv('EMAIL_SERVICE_NAME'),
        serviceHost: getOsEnv('EMAIL_SERVICE_HOST'),
        isSecure: toBool(getOsEnv('EMAIL_SERVICE_SECURE')),
        servicePort: getOsEnv('EMAIL_SERVICE_PORT'),
        // userName: getOsEnv('EMAIL_USER_NAME'),
        userPassword: getOsEnv('EMAIL_USER_PASSWORD'),
    },
    db: {
        mongoUrl: getOsEnv('MONGO_URL'),
    },
    jwt: {
        secret: getOsEnv('JWT_SECRET_KEY'),
        algorithm: getOsEnv('JWT_ALGORITHM'),
        expireIN: getOsEnv('JWT_EXPIRE_TIME'),
    },
    session:{
        name:getOsEnv('SESSION_NAME'),
        secret:getOsEnv('SESSION_SECRET'),
        expireIN: getOsEnv('SESSION_EXPIRE_TIME'),
    }

};
