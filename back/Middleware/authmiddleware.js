const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-me';

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded; // { id, email, is_admin }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Неверный или просроченный токен' });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Не авторизован' });
  }
  if (req.user.is_admin !== true) {
    return res.status(403).json({ message: 'Недостаточно прав' });
  }
  next();
};

module.exports = { authenticate, isAdmin, JWT_SECRET };