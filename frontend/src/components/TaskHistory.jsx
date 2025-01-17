import { useState, useEffect } from "react";
import Error from "./Error";
import { useNavigate } from "react-router-dom";
import './TaskHistory.css'; // Импортируем файл стилей

function TaskHistory() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchTasks(token);
        }
    }, [navigate]);

    const fetchTasks = async (token) => {
        const response = await fetch('http://localhost:3001/task', {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            setTasks(data);
            setError('');
        } else {
            const data = await response.json();
            setError(data.message);
            setTasks([]);
        }
    };

    return ( 
        <div className="task-history-container">
            <Error message={error} />
            <h3>История обращений</h3>
            {tasks.length > 0 ? (
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>ФИО</th>
                            <th>Категория</th>
                            <th>Статус</th>
                            <th>Описание</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.task_id}>
                                <td>{task.full_name}</td>
                                <td>{task.category_name}</td>
                                <td>{task.status_name}</td>
                                <td>{task.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Нет обращений</p>
            )}
        </div>
    );
}

export default TaskHistory;
