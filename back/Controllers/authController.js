const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/index');
const { JWT_SECRET } = require('../middleware/authMiddleware');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Все поля обязательны' });
      }

      const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );
      if (existing.rows.length > 0) {
        return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await pool.query(
        `INSERT INTO users (name, email, password, is_admin)
         VALUES ($1, $2, $3, FALSE)
         RETURNING id, name, email, is_admin`,
        [name, email, hashedPassword]
      );

      const user = result.rows[0];
      const token = jwt.sign(
        { id: user.id, email: user.email, is_admin: user.is_admin },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({ user, token });
    } catch (error) {
      console.error('register error:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны' });
      }

      const result = await pool.query(
        'SELECT id, name, email, password, is_admin FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Неверный email или пароль' });
      }

      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Неверный email или пароль' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, is_admin: user.is_admin },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      delete user.password;

      res.json({ user, token });
    } catch (error) {
      console.error('login error:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  async me(req, res) {
    try {
      const result = await pool.query(
        'SELECT id, name, email, is_admin FROM users WHERE id = $1',
        [req.user.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('me error:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
}

module.exports = new AuthController();