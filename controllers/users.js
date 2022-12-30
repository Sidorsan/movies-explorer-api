const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequestError } = require('../errors/BadRequestError');
const { ConflictError } = require('../errors/ConflictError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { jwtSecretDevelopmentMode } = require('../config');

const { NODE_ENV, JWT_SECRET } = process.env;
const SALT_ROUNDS = 10;
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
      })
        .then((userData) => res.status(201).send({
          email: userData.email,
          id: userData._id,
          name: userData.name,
        }))
        .catch((err) => {
          if (err.code === 11000) {
            next(
              new ConflictError('Пользователь с данным email уже существует'),
            );
          } else if (err.name === 'ValidationError') {
            next(new BadRequestError(err.message));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Нет пользователя с таким id'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный ID'));
        return;
      }
      if (err.code === 11000) {
        next(
          new ConflictError('Введеный email пренадлежит другому пользователю'),
        );
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Неправильная почта или пароль'));
        return;
      }
      bcrypt.compare(password, user.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          next(new UnauthorizedError('Неправильная почта или пароль'));
          return;
        }
        const tokenUser = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : jwtSecretDevelopmentMode,
          {
            expiresIn: '7d',
          },
        );
        res.send({ token: tokenUser });
      });
    })
    .catch(next);
};
