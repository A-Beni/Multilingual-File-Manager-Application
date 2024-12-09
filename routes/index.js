// Setup express router
import express from 'express';

// Import all the controllers
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';
import AuthController from '../controllers/AuthController.js';
import FilesController from '../controllers/FilesController.js';

// Import the middlewares
import { basicAuthenticate, xTokenAuthenticate } from '../middlewares/auth.js';
import { APIError, errorResponse } from '../middlewares/error.js';
import i18nMiddleware from '../middlewares/i18n.js';

// Verify all imports are defined
if (!AppController || !UsersController || !AuthController || !FilesController) {
  console.error('One or more controllers are undefined. Check imports.');
  process.exit(1);
}

const injectRoutes = (api) => {
  // Apply the translation middleware to the API
  api.use(i18nMiddleware);

  // Home route: with translatable welcome message
  api.get('/', (req, res) => {
    res.json({ message: req.t('welcome') });
  });

  // Routes for checking the status and stats of the API
  api.get('/status', AppController.getStatus || (() => { throw new Error('AppController.getStatus is not defined'); }));
  api.get('/stats', AppController.getStats || (() => { throw new Error('AppController.getStats is not defined'); }));

  // Routes for user management
  api.post('/users', UsersController.postNew || (() => { throw new Error('UsersController.postNew is not defined'); }));
  api.get('/users/me', xTokenAuthenticate, UsersController.getMe || (() => { throw new Error('UsersController.getMe is not defined'); }));
  api.delete('/users/me', xTokenAuthenticate, UsersController.deleteMe || (() => { throw new Error('UsersController.deleteMe is not defined'); }));
  api.get('/users', xTokenAuthenticate, UsersController.getIndex || (() => { throw new Error('UsersController.getIndex is not defined'); }));
  api.get('/users/:id', xTokenAuthenticate, UsersController.getShow || (() => { throw new Error('UsersController.getShow is not defined'); }));

  // Routes for user authentication
  api.get('/connect', basicAuthenticate, AuthController.getConnect || (() => { throw new Error('AuthController.getConnect is not defined'); }));
  api.get('/disconnect', xTokenAuthenticate, AuthController.getDisconnect || (() => { throw new Error('AuthController.getDisconnect is not defined'); }));

  // Routes for file management
  api.post('/files', xTokenAuthenticate, FilesController.postUpload || (() => { throw new Error('FilesController.postUpload is not defined'); }));
  api.get('/files/:id', xTokenAuthenticate, FilesController.getShow || (() => { throw new Error('FilesController.getShow is not defined'); }));
  api.get('/files', xTokenAuthenticate, FilesController.getIndex || (() => { throw new Error('FilesController.getIndex is not defined'); }));
  api.put('/files/:id/publish', xTokenAuthenticate, FilesController.putPublish || (() => { throw new Error('FilesController.putPublish is not defined'); }));
  api.put('/files/:id/unpublish', xTokenAuthenticate, FilesController.putUnpublish || (() => { throw new Error('FilesController.putUnpublish is not defined'); }));
  api.get('/files/:id/data', FilesController.getFile || (() => { throw new Error('FilesController.getFile is not defined'); }));
  api.delete('/files/:id', xTokenAuthenticate, FilesController.deleteFile || (() => { throw new Error('FilesController.deleteFile is not defined'); }));

  // Catch-all for undefined routes
  api.all('*', (req, res, next) => {
    const error = new APIError(404, `Cannot ${req.method} ${req.url}`);
    return errorResponse(error, req, res, next);
  });

  // Error handler middleware
  api.use(errorResponse);
};

export default injectRoutes;
