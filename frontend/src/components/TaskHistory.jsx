import { useState, useEffect } from "react";
import Error from "./Error";
import { useNavigate } from "react-router-dom";

function TaskHistory() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Перенаправление на страницу входа
        } else {
            fetchTasks(token); // Загружаем задачи только если токен есть
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
        <div>
            <Error message={error} />
            <h3>История обращений</h3>
            {tasks.length > 0 ? (
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '8px' }}>ФИО</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Категория</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Статус</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Описание</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.task_id}>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{task.full_name}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{task.category_name}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{task.status_name}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{task.description}</td>
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
