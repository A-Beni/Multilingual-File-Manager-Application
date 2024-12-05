import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';

export default class AuthController {
  static async getConnect(req, res) {
    try {
      const { user } = req;
      
      // Generate a new token
      const token = uuidv4();
      
      // Store token with user ID in Redis, expiring in 24 hours
      await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);
      
      // Return the token
      res.status(200).json({ token });
    } catch (error) {
      console.error('Connect Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getDisconnect(req, res) {
    try {
      const token = req.headers['x-token'] || 
                    (req.headers['authorization'] && 
                     req.headers['authorization'].split(' ')[1]);

      if (token) {
        await redisClient.del(`auth_${token}`);
      }

      res.status(204).send();
    } catch (error) {
      console.error('Disconnect Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}