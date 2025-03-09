import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
 * @api {middleware} authenticateToken Tarkistaa JWT-tokenin
 * @apiGroup Auth
 * @apiHeader {String} Authorization Bearer [token]
 * @apiError 401 Token puuttuu
 * @apiError 403 Token virheellinen
 */
const authenticateToken = (req, res, next) => {
  console.log('authenticateToken', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('token', token);
  if (token == undefined) {
    return res.sendStatus(401);
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).send('invalid token');
  }
};

export {authenticateToken};
