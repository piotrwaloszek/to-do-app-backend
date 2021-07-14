import { useState, useEffect } from 'react'
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [tasks, setTasks] = useState([
    {id: 1, name: 'Shopping'},
    {id: 2, name: 'Doctor Apointment'},])
  const [taskName, setTaskName] = useState('')

  const socket = io("http://localhost:8000");

  useEffect(() => {
    socket.on('upateData', (tasks) => {updateTasks(tasks)});
    socket.on('addTask', ({id, name}) => {addTask(id, name)});
    socket.on('removeTask', (id) => {removeTask(id)});
  })

  const updateTasks = (tasks) => {
    setTasks([tasks])
  }

  const addTask = (id, name) => {
    const newTask = {
      id,
      name,
    };
    setTasks([...tasks, newTask ]);
  }

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    socket.emit('removeTask', id);
  }

  const submitForm = (e) => {
    e.preventDefault();
    const id = uuidv4();
    addTask(id, taskName);
    socket.emit('addTask', { id: id, name: taskName });
    setTaskName('');
  }

  return (
    <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className='task'>
                {task.name}
                <button className="btn btn--red" onClick={() => removeTask(task.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <form 
            id="add-task-form"
            onSubmit={e => submitForm(e)}
            >
            <input 
              className='text-input'
              autoComplete="off" 
              type="text" 
              placeholder="Type your description" 
              id="task-name" 
              value={taskName}
              onChange={e => setTaskName(e.currentTarget.value)}
            />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
  )
}

export default App;