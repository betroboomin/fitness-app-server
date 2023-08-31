const express = require('express');
const router = express.Router();
const Users = require('../models/usersModel');
const jwt = require('jsonwebtoken');

// Get all books
router.get('/', async (req, res) => {
  const users = await Users.find();
  const count = await Users.countDocuments({});
  console.log('Number of users:', count);

  const data = {
    users: users,
    count: count
  };

  res.json(data);
});
// Get a single book by ID
router.get('/:id', async (req, res) => {
  const user = await Users.findById(req.params.id);
  res.json(user);
});




router.post('/login', async function(req, res) {
  const { email, password } = req.body;
  console.log('Email:',email);
  console.log('Pass:',password);

  const user = await Users.findOne({ email}).exec()
  console.log(user);
  // .exec()
  ;

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
    }else{
      console.log(user);
    }
    // Validate the user's credentials
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
      // Generate a JWT
      // const token = jwt.sign({ email: email }, 'secret', { expiresIn: '1h' });
      res.json({ id: user._id });
  })
// router.post('/login', async function(req, res) {
//   const email = req.body.email;
//   const password = req.body.password;

//   const user = await Users.findOne({ email: email}).exec();

//   if (!user) {
//     return res.status(401).json({ message: 'Invalid email or password' });
//     }
//     // Validate the user's credentials
//     if (password !== user.password) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
//       // Generate a JWT
//       const token = jwt.sign({ email: email }, 'secret', { expiresIn: '1h' });
//       res.json({ token: token });
//   })


router.get('/protected', isAuthenticated, function(req, res) {
  res.status(200).json({message:'You are authenticated!'});
});
function isAuthenticated(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token' });
  }
}



// Create a new book
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const user = new Users({ email, password });
  await user.save();
  console.log(user);
  res.status(200).json(user);
});


// Update an existing book
router.put('/:id', async (req, res) => {
  const { email, password} = req.body;
  const user = await Users.findByIdAndUpdate(req.params.id, { email, password }, { new: true });
  res.json(user);
});

// Delete a book
router.delete('/:id', async (req, res) => {
  await Users.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

module.exports = router;