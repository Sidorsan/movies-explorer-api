const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const auth = require('../middlewares/auth');
const regexEmailCheck = require('../util/regex');
const {
  getUsers,
  updateUser,
  getCurrentUser,
  createUser,
  login,
} = require('../controllers/users');

router.get('/users', getUsers);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      // email: Joi.string().required().email(),
      email: Joi.string().required().pattern(regexEmailCheck),
      password: Joi.string().required().min(2).max(30),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      // email: Joi.string().required().email(),
      email: Joi.string().required().pattern(regexEmailCheck),
      password: Joi.string().required(),
      name: Joi.string().required().min(2).max(30),
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
      // email: Joi.string().required().email(),
      email: Joi.string().required().pattern(regexEmailCheck),
    }),
  }),
  updateUser,
);
router.get('/users/me', getCurrentUser);
module.exports = router;
