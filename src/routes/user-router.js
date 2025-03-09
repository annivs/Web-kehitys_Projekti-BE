import express from 'express';
import { body } from 'express-validator';
import {
  addUser,
  getUserById,
  getUsers,
} from '../controllers/user-controller.js';
import { authenticateToken } from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handler.js';

const userRouter = express.Router();

/**
 * @api {get} /api/users Get all users
 * @apiName GetUsers
 * @apiGroup User
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 * @apiSuccess {Object[]} users List of users.
 * @apiSuccess {Number} users.user_id User's ID.
 * @apiSuccess {String} users.username User's username.
 * @apiSuccess {String} users.email User's email.
 * @apiSuccess {String} users.created_at User's registration date.
 * @apiError {String} message Error message
 * @apiError {Number} code Error code
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "message": "invalid token",
 *       "code": 403
 *     }
 */
userRouter.route('/').get(authenticateToken, getUsers);

/**
 * @api {post} /api/users Add new user
 * @apiName AddUser
 * @apiGroup User
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 * @apiBody {String} username Username (3-20 characters, alphanumeric).
 * @apiBody {String} password Password (8-120 characters).
 * @apiBody {String} email User's email address.
 * @apiSuccess {String} message Success message
 * @apiSuccess {Number} user_id Newly created user's ID.
 * @apiError {String} message Error message
 * @apiError {Number} code Error code
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Invalid data",
 *       "code": 400
 *     }
 */
userRouter.route('/').post(
  body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
  body('password').trim().isLength({ min: 8, max: 120 }),
  body('email').trim().isEmail(),
  validationErrorHandler,
  addUser,
);

/**
 * @api {get} /api/users/:id Get user details by ID
 * @apiName GetUserById
 * @apiGroup User
 * @apiParam {Number} id User's unique ID.
 * @apiSuccess {Object} user User details.
 * @apiSuccess {Number} user.user_id User's ID.
 * @apiSuccess {String} user.username User's username.
 * @apiSuccess {String} user.email User's email.
 * @apiSuccess {String} user.created_at User's registration date.
 * @apiError {String} message Error message
 * @apiError {Number} code Error code
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "User not found",
 *       "code": 404
 *     }
 */
userRouter.route('/:id').get(getUserById);

export default userRouter;