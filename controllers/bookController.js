const express = require('express');
const router = express.Router();
const Book = require('../models/bookModel');

// Get all books
router.get('/', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Get a single book by ID
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.json(book);
});

// Create a new book
router.post('/', async (req, res) => {
    const { title, author, pages } = req.body;
    const book = new Book({ title, author, pages });
    await book.save();
    res.sendStatus(200);
  
});

// Update an existing book
router.put('/:id', async (req, res) => {
  const { title, author, pages } = req.body;
  const book = await Book.findByIdAndUpdate(req.params.id, { title, author, pages }, { new: true });
  res.json(book);
});

// Delete a book
router.delete('/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.send(req.params.id+" deleted successfully");
});

module.exports = router;