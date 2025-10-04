const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prismaClient');
const { verifyGoogleToken } = require('../utils/googleAuth');

// Login com email e senha
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário com Prisma
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(senha, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};

// Login com Google OAuth
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token do Google é obrigatório'
      });
    }

    // Verificar token do Google
    const googleUser = await verifyGoogleToken(token);

    // Buscar ou criar usuário com Prisma
    let user = await prisma.user.findUnique({
      where: { googleId: googleUser.googleId }
    });

    if (!user) {
      // Verificar se já existe usuário com o mesmo email
      const existingUser = await prisma.user.findUnique({
        where: { email: googleUser.email }
      });

      if (existingUser) {
        // Atualizar usuário existente para incluir Google ID
        user = await prisma.user.update({
          where: { email: googleUser.email },
          data: {
            googleId: googleUser.googleId,
            picture: googleUser.picture || existingUser.picture
          }
        });
      } else {
        // Criar novo usuário
        user = await prisma.user.create({
          data: {
            googleId: googleUser.googleId,
            name: googleUser.name,
            email: googleUser.email,
            picture: googleUser.picture,
            password: null // Usuário Google não tem senha
          }
        });
      }
    }

    // Gerar token JWT próprio
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Erro no login Google:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Token do Google inválido'
    });
  }
};

// Registro de novo usuário
exports.register = async (req, res) => {
  try {
    const { name, email, senha } = req.body;

    // Validação básica
    if (!name || !email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    // Validar senha (mínimo 8 caracteres)
    if (senha.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter no mínimo 8 caracteres'
      });
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};

// Verificar token
exports.verifyToken = async (req, res) => {
  try {
    // O middleware já validou o token e adicionou o userId ao req
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor'
    });
  }
};