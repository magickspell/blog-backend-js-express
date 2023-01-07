import jwt from 'jsonwebtoken';
const SECRET = 'secretKey123'; // todo вынести secretKey123 в константу

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');

  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET);
      req.userId = decoded._id;
      next();
    } catch (e) {

    }
  } else {
    return res.status(403).json({
      success: false,
      message: 'no token provided.',
      error: `error: no token provided.`,
    });
  }
}