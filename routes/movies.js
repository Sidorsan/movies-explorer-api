const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const auth = require('../middlewares/auth');
const regexUrlCheck = require('../util/regex');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.use(auth);

router.get('/movies', getMovies);

router.post(
  '/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(30),
      director: Joi.string().required().min(2).max(30),
      duration: Joi.number().required().min(2).max(1000),
      year: Joi.string().required().min(2).max(4),
      description: Joi.string().required().min(2).max(300),
      image: Joi.string().required().pattern(regexUrlCheck),
      trailerLink: Joi.string().required().pattern(regexUrlCheck),
      nameRU: Joi.string().required().min(2).max(30),
      nameEN: Joi.string().required().min(2).max(30),
      thumbnail: Joi.string().required().pattern(regexUrlCheck),
      movieId: Joi.number().required().min(2).max(30),
    }),
  }),
  createMovie,
);

router.delete(
  '/movies/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().required().length(24),
    }),
  }),
  deleteMovie,
);

module.exports = router;
