import express from 'express';
import {getEntries, postEntry, deleteEntryController} from '../controllers/entry-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';
import {body} from 'express-validator';
import {validationErrorHandler} from '../middlewares/error-handler.js';


const entryRouter = express.Router();

/**
 * @api {get} /api/entries Get all entries for the logged-in user
 * @apiName GetEntries
 * @apiGroup Entries
 * @apiPermission token
 * @apiHeader {String} Authorization Bearer token.
 *
 * @apiSuccess {Object[]} entries List of entries
 * @apiSuccess {String} entries.entry_date Date of the entry
 * @apiSuccess {String} entries.mood User's mood
 * @apiSuccess {Number} entries.sleep_hours Hours of sleep
 * @apiSuccess {String} entries.notes Additional notes
 *
 * @apiError InvalidToken Authentication token was invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "message": "invalid token"
 *     }
 */
entryRouter
  .route('/')
  .post(
    authenticateToken,
    body('entry_date').notEmpty().isDate(),
    body('mood').trim().notEmpty().isLength({min: 3, max: 25}).escape(),
    body('sleep_hours').isInt({min: 0, max: 24}),
    body('notes').trim().escape(),
    validationErrorHandler,
    postEntry,
  )
  .get(authenticateToken, getEntries)
 
entryRouter
  .route('/:id')
  .delete(authenticateToken, deleteEntryController);

export default entryRouter;