import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import injectRoutes from './routes/index.js';
import injectMiddlewares from './libs/middlewares.js';
import startServer from './libs/boot.js';
import i18nMiddleware from './middlewares/i18n.js';

// Initialize the server
const server = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Directory where files are stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});
const upload = multer({ storage });

// Middleware to parse JSON request bodies
server.use(bodyParser.json());

// Apply translation middleware globally
server.use(i18nMiddleware);

// File upload route
server.post('/files', upload.single('money'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  res.status(200).json({
    message: 'File uploaded successfully!',
    file: req.file, // Return uploaded file details
  });
});

// Inject additional middlewares and routes
injectMiddlewares(server);
injectRoutes(server);

// Start the server
startServer(server);

export default server;
