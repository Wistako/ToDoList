const express = require('express');
const path = require('path');
const socket = require('socket.io');
const cors = require('cors');

const app = express();

const taskList = [
  { id: 1, name: 'Shopping' },
  { id: 2, name: 'Go out with a dog' },
  { id: 3, name: 'Do some coding' },
  { id: 4, name: 'Read a book' },
  { id: 5, name: 'Prepare a dinner' },
];

app.use(cors());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(8000, () => {
  console.log('Server started on http://localhost:8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('Socket connection established' + socket.id);
  socket.emit('updateData', taskList);

  socket.on('addTask', (task) => {
    taskList.push(task);
    socket.broadcast.emit('addTask', task);
  });

  socket.on('removeTask', (id) => {
    const index = taskList.findIndex((task) => task.id === id);
    taskList.splice(index, 1);
    socket.broadcast.emit('removeTask', id);
  });

  socket.on('editTask', (task) => {
    const index = taskList.findIndex((t) => t.id === task.id);
    taskList[index] = task;
    socket.broadcast.emit('editTask', task);
  });

});
