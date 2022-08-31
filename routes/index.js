const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { NotFoundError } = require('../errors/NotFoundError');

router.use(userRouter);
router.use(movieRouter);
router.use(() => {
  throw new NotFoundError('Wrong URL');
});

module.exports = router;
