const express = require('express');
const { getUserByName } = require('../services/name');

const router = express.Router();

// Route to get a user by name
router.get('/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const user = await getUserByName(name);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Name not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;