const Movie = require('../models/movie');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequestError } = require('../errors/BadRequestError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.status(200).send(movie))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const dataMovie = req.body;
  const owner = req.user._id;

  Movie.create({
    country: dataMovie.country,
    director: dataMovie.director,
    duration: dataMovie.duration,
    year: dataMovie.year,
    description: dataMovie.description,
    image: dataMovie.image,
    trailerLink: dataMovie.trailerLink,
    nameRU: dataMovie.nameRU,
    nameEN: dataMovie.nameEN,
    thumbnail: dataMovie.thumbnail,
    movieId: dataMovie.movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Фильм не найден'));
      }

      if (req.user._id.toString() !== movie.owner.toString()) {
        return next(new ForbiddenError('Нельзя удалить фильм другого пользователя'));
      }
      return Movie.deleteOne(movie).then(() => res.status(200).send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный ID'));
        return;
      }
      next(err);
    });
};
