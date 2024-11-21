const express = require('express');
const authController = require('../controllers/authController');
const fileController = require('../controllers/fileController');
const i18n = require('../middlewares/i18n');

const router = express.Router();
router.use(i18n);

// Authentication
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// File Management
router.post('/files', fileController.createFile);
router.get('/files/:fileName', fileController.readFile);
router.put('/files/:fileName', fileController.updateFile);
router.delete('/files/:fileName', fileController.deleteFile);

module.exports = router;
