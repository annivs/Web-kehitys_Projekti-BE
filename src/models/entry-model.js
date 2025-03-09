import promisePool from '../utils/database.js';

/**
 * @api {function} insertEntry Lisää päiväkirjamerkinnän
 * @apiGroup Entries
 * @apiDescription Tämä funktio lisää uuden päiväkirjamerkinnän tietokantaan käyttäjän syöttämillä tiedoilla.
 * @apiBody {Number} user_id Käyttäjän ID, johon merkintä liittyy
 * @apiBody {String} entry_date Päivämäärä, jolloin merkintä on tehty (formaatti: YYYY-MM-DD)
 * @apiBody {String} mood Käyttäjän mieliala päiväkirjassa
 * @apiBody {Number} sleep_hours Unetunnit päiväkirjassa
 * @apiBody {String} notes Merkinnän muistiinpanot
 * @apiError 500 Tietokantavirhe
 * @apiSuccess {Number} insertId Tietokannan palauttama ID lisätylle merkinnälle
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
 * @api {function} selectEntriesByUserId Hakee käyttäjän merkinnät
 * @apiGroup Entries
 * @apiDescription Tämä funktio hakee kaikki päiväkirjamerkinnät tietyn käyttäjän ID:n perusteella.
 * @apiParam {Number} userId Käyttäjän ID, jonka merkinnät haetaan
 * @apiSuccess {Object[]} entries Lista merkinnöistä
 * @apiSuccess {Number} entries.user_id Käyttäjän ID, johon merkintä liittyy
 * @apiSuccess {String} entries.entry_date Päivämäärä, jolloin merkintä on tehty
 * @apiSuccess {String} entries.mood Käyttäjän mieliala päiväkirjassa
 * @apiSuccess {Number} entries.sleep_hours Unetunnit
 * @apiSuccess {String} entries.notes Merkinnän muistiinpanot
 * @apiError 500 Tietokantavirhe
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
 * @api {function} deleteEntry Poistaa päiväkirjamerkinnän
 * @apiGroup Entries
 * @apiDescription Tämä funktio poistaa päiväkirjamerkinnän tietokannasta merkinnän ID:n perusteella.
 * @apiParam {Number} entryId Merkinnän ID, joka poistetaan
 * @apiError 500 Tietokantavirhe
 * @apiError 404 Merkintää ei löytynyt
 * @apiSuccess {String} message Viesti, että merkintä on poistettu
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

export {insertEntry, selectEntriesByUserId, deleteEntry};