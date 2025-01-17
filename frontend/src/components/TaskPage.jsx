import Error from "./Error";
import Notification from "./Notification";
import React, { useState } from "react";
import {useNavigate} from 'react-router-dom';

function TaskPage() {
    const category = [
       {id:'1', name: "Технические проблемы"},
       {id:'2', name: "Общие вопросы и предложения"},
       {id:'3', name: "Запрос на обновление информации"}
    ];

    const [error, setError] = useState('');
    const [notification, setNotification] = useState('');
    const [id_category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    const navigate = useNavigate();

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleTask = async () => {
        if (!id_category || !description) {
            setError('Все поля должны быть заполнены!');
            return;
        }
        
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:3001/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({id_category, description})
        });

        if (response.ok) {
            setNotification('Обращение успешно отправлено!');
            setTimeout(() => setNotification(''), 3000);
            setError('');
            setCategory('');
            setDescription('');
        } else {
            const data = await response.json();
            setError(data.message);
        }
    }

    return ( 
        <div>
            <Error message={error} />
            <Notification message={notification} />

            <h3>Создать обращение</h3>

            <select value={id_category} onChange={(e) => setCategory(e.target.value)}>
                <option value="" disabled>Выберите категорию</option>
                {category.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                ))}
            </select>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" cols="50" placeholder="Опишите вашу проблему..."></textarea>
            <button type="button" onClick={handleTask}>Отправить обращение</button>
        </div>
     );
}

export default TaskPage;