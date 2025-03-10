import promisePool from '../utils/database.js';

/**
 * @api {function} insertEntry Add a diary entry
 * @apiGroup Entries
 * @apiDescription This function adds a new diary entry to the database with the user's input data.
 * @apiBody {Number} user_id The ID of the user to whom the entry belongs
 * @apiBody {String} entry_date The date the entry was created (format: YYYY-MM-DD)
 * @apiBody {String} mood The user's mood in the diary entry
 * @apiBody {Number} sleep_hours The number of sleep hours recorded in the diary
 * @apiBody {String} notes Notes for the diary entry
 * @apiError 500 Database error
 * @apiSuccess {Number} insertId The ID of the newly added entry returned by the database
 */

const insertEntry = async (entry) => {
  try {
    const [result] = await promisePool.query(
      'INSERT INTO DiaryEntries (user_id, entry_date, mood, sleep_hours, notes) VALUES (?, ?, ?, ? ,?)',
      [entry.user_id, entry.entry_date, entry.mood, entry.sleep_hours, entry.notes],
    );
    console.log('inserEntry', result);
    // return only first item of the result array
    return result.insertId;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

/**
 * @api {function} selectEntriesByUserId Fetch user's diary entries
 * @apiGroup Entries
 * @apiDescription This function retrieves all diary entries based on a specific user ID.
 * @apiParam {Number} userId The ID of the user whose entries are being retrieved
 * @apiSuccess {Object[]} entries List of diary entries
 * @apiSuccess {Number} entries.user_id The ID of the user to whom the entry belongs
 * @apiSuccess {String} entries.entry_date The date the entry was created
 * @apiSuccess {String} entries.mood The user's mood in the diary entry
 * @apiSuccess {Number} entries.sleep_hours Number of sleep hours recorded
 * @apiSuccess {String} entries.notes Notes for the diary entry
 * @apiError 500 Database error
 */


const selectEntriesByUserId = async (userId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM DiaryEntries WHERE user_id=?',
      [userId],
    );
    console.log(rows);
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error('database error');
  }
};

/**
 * @api {function} deleteEntry Delete a diary entry
 * @apiGroup Entries
 * @apiDescription This function deletes a diary entry from the database based on the entry ID.
 * @apiParam {Number} entryId The ID of the entry to be deleted
 * @apiError 500 Database error
 * @apiError 404 Entry not found
 * @apiSuccess {String} message Message confirming that the entry has been deleted
 */

const deleteEntry = async (entryId) => {
  try {
    // Poistetaan merkintä tietokannasta ID:n perusteella
    const [result] = await promisePool.query(
      'DELETE FROM DiaryEntries WHERE entry_id = ?',
      [entryId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Merkintää ei löytynyt');
    }

    console.log('deleteEntry', result);
    return { message: 'Päiväkirjamerkintä poistettu.' };
  } catch (error) {
    console.error(error);
    if (error.message === 'Merkintää ei löytynyt') {
      throw new Error('Merkintää ei löytynyt');
    }
    throw new Error('database error');
  }
};

/**
 * @api {function} updateEntry Update a diary entry
 * @apiGroup Entries
 * @apiDescription This function updates a diary entry in the database based on the entry ID and the user's input data.
 * @apiParam {Number} entryId The ID of the entry to be updated
 * @apiBody {String} mood The user's mood in the diary entry
 * @apiBody {Number} sleep_hours Number of sleep hours recorded
 * @apiBody {String} notes Notes for the diary entry
 * @apiError 500 Database error
 * @apiError 404 Entry not found
 * @apiSuccess {String} message Message confirming that the entry has been updated
 */

const updateEntry = async (entryId, mood, sleep_hours, notes) => {
  try {
    const [result] = await promisePool.query(
      'UPDATE DiaryEntries SET mood = ?, sleep_hours = ?, notes = ? WHERE entry_id = ?',
      [mood, sleep_hours, notes, entryId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Merkintää ei löytynyt');
    }

    console.log('updateEntry', result);
    return { message: 'Merkintä päivitetty onnistuneesti' };
  } catch (error) {
    console.error(error);
    if (error.message === 'Merkintää ei löytynyt') {
      throw new Error('Merkintää ei löytynyt');
    }
    throw new Error('Tietokantavirhe');
  }
};
export {insertEntry, selectEntriesByUserId, deleteEntry, updateEntry};