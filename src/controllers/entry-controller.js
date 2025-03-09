import {insertEntry, selectEntriesByUserId, deleteEntry} from '../models/entry-model.js';

const postEntry = async (req, res, next) => {
  // user_id, entry_date, mood,sleep_hours, notes
  const newEntry = req.body;
  newEntry.user_id = req.user.user_id;
  try {
    await insertEntry(newEntry);
    res.status(201).json({message: "Entry added."});
  } catch (error) {
    next(error);
  }
};

/**
 * Get all entries of the logged in user
 * @param {*} req
 * @param {*} res
 */
const getEntries = async (req, res, next) => {
  try {
    const entries = await selectEntriesByUserId(req.user.user_id);
    res.json(entries);
  } catch (error) {
    next(error);
  }
};


// Poistetaan merkintä
const deleteEntryController = async (req, res) => {
  try {
    const entryId = req.params.id;
    const result = await deleteEntry(entryId);  // Poistetaan merkintä modelista
    res.json(result);  // Palautetaan onnistumisviesti
  } catch (error) {
    if (error.message === 'Merkintää ei löytynyt') {
      res.status(404).json({ message: 'Päiväkirjamerkintää ei löytynyt.' });
    } else {
      res.status(500).json({ message: 'Tietokantavirhe' });
    }
  }
};

export {postEntry, getEntries, deleteEntryController};