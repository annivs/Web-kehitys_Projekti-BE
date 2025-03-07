const items = [
  {
    id: 1,
    name: 'omena',
  },
  {
    id: 2,
    name: 'appelsiini',
  },
  {
    id: 3,
    name: 'porkkana',
  },
  {
    id: 3,
    name: 'mandariini',
  },
];

// kaikkien itemien haku
const getItems = (req, res) => {
  res.json(items);
};

// itemin haku id:n perusteella

const getItemByID = (req, res) => {
  console.log('getItemByID', req.params.id);
  const item = items.find((item) => item.id == req.params.id);
  console.log('item found:', item);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({message: 'Item not found'});
  }
};
// itemien lisääminen
const addItem = (req, res) => {
  console.log('addItems request body', req.body);

  // jos pyynnössä on name- ominaisuuden, lisätään uusi asia items-taulukkoon
  if (req.body.name) {
    // generoidaan id-numero uudelle asialle
    const latestId = items[items.length - 1].id;

    // Luodaan uusi asia olio ja lisätään se items-tauluun
    const newItem = {id: latestId + 1, name: req.body.name};
    items.push(newItem);
    res.status(201);
    return res.json({message: 'Item added.'});
  }
  res.status(400);
  return res.json({message: 'Request is missing name property.'});
};

const deleteItem = (req, res) => {
  console.log('deleteItem', req.params.id);
  const index = items.findIndex((item) => item.id == req.params.id);
  //console.log('index', index);
  // findIndex returns -1 if item is not found
  if (index !== -1) {
    // remove one item from array based on index
    items.splice(index, 1);
    res.json({message: 'Item deleted.'});
  } else {
    res.status(404).json({message: 'Item not found'});
  }
};

const editItem = (req, res) => {
  console.log('editItem request body', req.body);
  const item = items.find((item) => item.id == req.params.id);
  if (item) {
    item.name = req.body.name;
    res.json({message: 'Item updated.'});
  } else {
    res.status(404).json({message: 'Item not found'});
  }
};

export {getItems, getItemByID, addItem, deleteItem, editItem};
