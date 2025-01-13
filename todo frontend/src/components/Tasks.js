import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tasks.css'; 
import Navbar from './Navbar';
import { Fragment } from 'react';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [error, setError] = useState('');

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/api/tasks/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data);
        } catch (err) {
            setError('Failed to load tasks');
        }
    };

    const addTask = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://127.0.0.1:8000/api/tasks/',
                { task: newTask },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks([...tasks, response.data]);
            setNewTask('');
        } catch (err) {
            setError('Failed to add task');
        }
    };

    const deleteTask = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.filter((task) => task.id !== id));
        } catch (err) {
            setError('Failed to delete task');
        }
    };

    const toggleTaskCompletion = async (id, completed) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://127.0.0.1:8000/api/tasks/${id}/`,
                { completed: !completed },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(
                tasks.map((task) =>
                    task.id === id ? { ...task, completed: response.data.completed } : task
                )
            );
        } catch (err) {
            setError('Failed to update task');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <Fragment><Navbar />

        
        <div className="tasks-container">
            
            <h1>To-Do List</h1>
            <div className="input-container">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add new task"
                />
                <button onClick={addTask}>Add Task</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            <ul className="tasks-list">
                {tasks.map((task) => (
                    <li key={task.id} className={task.completed ? 'completed-task' : ''}>
                        <span>{task.task}</span>
                        <button
                            onClick={() => toggleTaskCompletion(task.id, task.completed)}
                            className={task.completed ? 'undo-button' : 'complete-button'}
                        >
                            {task.completed ? 'Undo Completion' : 'Mark as Completed'}
                        </button>
                        <button onClick={() => deleteTask(task.id) } className='undo-button'>Delete</button>
                    </li>
                ))}
            </ul>
        </div></Fragment>
    );
};

export default Tasks;
