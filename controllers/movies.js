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
  const {
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country, director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId, owner,
  })
    .then((movie) => res.send(
      // country: movie.country,
      // director: movie.director,
      // duration: movie.duration,
      // year: movie.year,
      // description: movie.description,
      // image: movie.image,
      // trailerLink: movie.trailerLink,
      // nameRU: movie.nameRU,
      // nameEN: movie.nameEN,
      // thumbnail: movie.thumbnail,
      // movieId: movie.movieId,
      movie,
    ))
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
