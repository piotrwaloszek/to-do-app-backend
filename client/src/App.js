import React from 'react'
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  
  state = { 
    tasks: [],
    taskName: ''
  }

  componentDidMount() {
    this.socket = io((process.env.NODE_ENV === 'production') ? '' : 'localhost:8000', { transports: ["websocket"] })
  
    this.socket.on('updateTasks', (tasks) => {this.updateTasks(tasks)});
    this.socket.on('addTask', ({id, name}) => { this.addTask(id, name)});
    this.socket.on('removeTask', (id) => {this.removeTask(id)});
  }

  updateTasks = (tasks) => {
    this.setState({ tasks: [...tasks] })
  }

  addTask = (id, name) => {
    const newTask = {
      id,
      name,
    };
    this.setState({ tasks: [ ...this.state.tasks, newTask ] });
  }

  removeTask = (id) => {
    this.setState({tasks: this.state.tasks.filter(task => task.id !== id)});
    if(id) this.socket.emit('removeTask', id);
  }

  submitForm = (e) => {
    e.preventDefault();
    const id = uuidv4();
    this.addTask(id, this.state.taskName);
    this.socket.emit('addTask', { id: id, name: this.state.taskName });
    this.setState({ taskName: ''})
  }

  render() {

    const { tasks, taskName } = this.state
    const { removeTask, submitForm } = this

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
                onChange={e => this.setState({ taskName: e.currentTarget.value })}
              />
              <button className="btn" type="submit">Add</button>
            </form>
      
          </section>
        </div>
    )
  }
}

export default App;