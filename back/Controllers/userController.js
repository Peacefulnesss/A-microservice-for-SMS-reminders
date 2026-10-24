const pool = require('../db/index');
const bcrypt = require('bcrypt');

class UserController {
  async getAllUsers(req, res) {
    try {
      const user = await pool.query(
        `SELECT id, name, email, is_admin FROM users`
      );
      res.json(user.rows);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  async getUserById(req, res) {
    const id = parseInt(req.params.id, 10);
    if (!req.user.is_admin && req.user.id !== id) {
      return res.status(403).json({ message: 'Доступ запрещён' });
    }

    try {
      const user = await pool.query(
        `SELECT id, name, email, is_admin FROM users WHERE id = $1`,
        [id]
      );
      if (user.rows.length === 0) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      res.json(user.rows[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  async createUser(req, res) {
    const { name, email, password, is_admin = false } = req.body;
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await pool.query(
        `INSERT INTO users (name, email, password, is_admin)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, is_admin`,
        [name, email, hashedPassword, is_admin]
      );
      res.status(201).json(user.rows[0]);
    } catch (error) {
      console.error('error', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  async updateUser(req, res) {
    const id = parseInt(req.params.id, 10);
    const { name, email, password } = req.body;

    if (!req.user.is_admin && req.user.id !== id) {
      return res.status(403).json({ message: 'Доступ запрещён' });
    }

    try {
      let result;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        result = await pool.query(
          `UPDATE users SET name = $1, email = $2, password = $3
           WHERE id = $4 RETURNING id, name, email, is_admin`,
          [name, email, hashedPassword, id]
        );
      } else {
        result = await pool.query(
          `UPDATE users SET name = $1, email = $2
           WHERE id = $3 RETURNING id, name, email, is_admin`,
          [name, email, id]
        );
      }

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      console.error('error', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  async deleteUser(req, res) {
    const id = parseInt(req.params.id, 10);

    if (!req.user.is_admin && req.user.id !== id) {
      return res.status(403).json({ message: 'Доступ запрещён' });
    }

    try {
      const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }
      res.json({ message: 'Пользователь удалён' });
    } catch (error) {
      console.error('error', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
}

module.exports = new UserController();