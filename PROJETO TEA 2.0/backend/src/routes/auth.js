const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/register', authController.register);

// Rotas protegidas
router.get('/verify', authMiddleware, authController.verifyToken);

module.exports = router;