const Todo = require('../models/todoModel');

const todoController = {};

// Get all todos
todoController.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Create a new todo
todoController.createTodo = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ msg: 'Title is required' });
  }

  try {
    const newTodo = new Todo({
      title,
      description,
    });

    const savedTodo = await newTodo.save();

    res.status(201).json(savedTodo);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Update an existing todo
todoController.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title,
        description,
        completed,
      },
      { new: true },
    );

    if (!updatedTodo) {
      return res.status(404).json({ msg: 'Todo not found' });
    }

    res.status(200).json(updatedTodo);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Delete an existing todo
todoController.deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ msg: 'Todo not found' });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = todoController;