const express = require('express');
const cors = require('cors');
const socket = require('socket.io');

const app = express();

app.use(cors());

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client ' + socket.id);
    
    socket.emit('updateTasks', tasks);

    socket.on('addTask', ({id, name}) => {
        tasks.push({id, name});
        socket.broadcast.emit('addTask', {id, name});
    });

    socket.on('removeTask', (taskToRemove) => {
        socket.broadcast.emit('removeTask', taskToRemove);
        tasks.splice(taskToRemove, 1);
    })
})
