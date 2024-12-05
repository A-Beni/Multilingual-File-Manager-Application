import { getUserFromXToken, getUserFromAuthorization } from '../utils/auth';
import mongoDBCore from 'mongodb/lib/core';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

// Basic authentication middleware: applies basic authentication to a route
export const basicAuthenticate = async (req, res, next) => {
  try {
    console.log('Basic Authentication: Checking credentials...');
    const user = await getUserFromAuthorization(req);

    if (!user) {
      console.error('Basic Authentication Failed: User not found or invalid credentials.');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('Basic Authentication Successful:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('Basic Authentication Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// X-Token authentication middleware: applies x-token authentication to a route
export const xTokenAuthenticate = async (req, res, next) => {
  try {
    console.log('X-Token Authentication: Checking token...');

    const user = await getUserFromXToken(req);

    if (!user) {
      console.error('X-Token Authentication Failed: User not found or token invalid.');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('X-Token Authentication Successful:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('X-Token Authentication Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};