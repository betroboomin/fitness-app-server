const express = require('express');
const {Server} = require('ws');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bookController = require('./controllers/bookController');
const usersController = require('./controllers/usersControllers');
const todoController = require('./controllers/todoController');
const excerciseController = require('./controllers/excerciseController');
const loginController = require('./controllers/loginController')
const photoController = require('./controllers/photo.controller')
const path = require('path');
// const uploads = require('./uploads')
const exerciseCategoryController = require('./controllers/exercisecategoryController')
const exerciselevelcontroller = require('./controllers/exerciselevelcontroller')
const Todo = require('./models/todoModel');
const { json } = require('express/lib/response');

const app = express();
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/todos', { useNewUrlParser: true,
useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(cors());

app.use('/books', bookController);
app.use('/users', usersController);
app.use('/exercise', excerciseController);
app.use('/login', loginController);
app.use('/exercisecategory', exerciseCategoryController);
app.use('/exerciselevel', exerciselevelcontroller);
app.use('/photoUpload',photoController);
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.get('/todos', todoController.getTodos);
app.post('/todos', todoController.createTodo);
app.put('/todos/:id', todoController.updateTodo);
app.delete('/todos/:id', todoController.deleteTodo);




// app.listen(4000, () => {
//   console.log('Server started on port 4000')});
// });
const server = app.use((req,res)=> res.send('Hello World')).listen(4000, () => {
  console.log('Server started on port 4000');
})
// const wss = new Server({server});
// wss.on('connection', (ws) => {
//   console.log('Client connected');

//   // Todo.find().then((todos) => {
//   //   ws.send(JSON.stringify({ action: 'init', todos }));
//   // });



//   ws.on('message', async (data) => {
//     const { msg, password } = JSON.parse(data);

//     // Create a new Todo document with the message and password
//     const todo = new Todo({ title: msg, description: password, completed: false });

//     try {
//       // Save the Todo document to the database
//       const savedTodo = await todo.save();
//       console.log('Todo saved:', savedTodo);
      
//     ws.send(JSON.stringify(savedTodo));
//     } catch (error) {
//       console.error('Error saving todo:', error);
//     }

//   });





//   ws.on('message', message => console.log(`Recieved: ${message}`))
//   ws.on('close', () => console.log('client disconnected'))
// })
