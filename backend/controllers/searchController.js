const SearchModel = require('../models/searchModel');

exports.search = async (req, res) => {
  const { q, type, limit, offset } = req.query;
  if (!q) return res.status(400).json({ message: 'q is required' });

  try {
    let results;
    if (type === 'files') results = await SearchModel.searchFiles(q, limit, offset);
    else if (type === 'events') results = await SearchModel.searchEvents(q, limit, offset);
    else results = await SearchModel.searchAll(q, limit, offset);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
