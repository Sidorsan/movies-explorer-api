const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const auth = require('../middlewares/auth');

const regexUrlCheck = require('../util/regex');

const {
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
  createUser,
  login,
} = require('../controllers/users');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(2).max(30),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(regexUrlCheck),
    }),
  }),
  createUser,
);

router.use(auth);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateUser,
);

// router.patch(
//   '/users/me/avatar',
//   celebrate({
//     body: Joi.object().keys({
//       avatar: Joi.string().required().pattern(regexUrlCheck),
//     }),
//   }),
//   updateUserAvatar,
// );

router.get('/users/me', getCurrentUser);

// router.get(
//   '/users/:id',
//   celebrate({
//     params: Joi.object().keys({
//       id: Joi.string().hex().required().length(24),
//     }),
//   }),
//   getUser,
// );
module.exports = router;
