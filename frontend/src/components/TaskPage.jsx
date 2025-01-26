import Error from './Error'
import Notification from './Notification'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TaskPage() {
	const category = [
		{ id: '1', name: 'Технические проблемы' },
		{ id: '2', name: 'Общие вопросы и предложения' },
		{ id: '3', name: 'Запрос на обновление информации' },
	]

	const [error, setError] = useState('')
	const [notification, setNotification] = useState('')
	const [id_category, setCategory] = useState('')
	const [description, setDescription] = useState('')

	const navigate = useNavigate()

	React.useEffect(() => {
		const token = localStorage.getItem('token')
		if (!token) {
			navigate('/login')
		}
	}, [navigate])

	const handleTask = async () => {
		if (!id_category || !description) {
			setError('Все поля должны быть заполнены!')
			return
		}

		const token = localStorage.getItem('token')

		const response = await fetch('http://localhost:3001/task', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ id_category, description }),
		})

		if (response.ok) {
			setNotification('Обращение успешно отправлено!')
			setTimeout(() => setNotification(''), 3000)
			setError('')
			setCategory('')
			setDescription('')
		} else {
			const data = await response.json()
			setError(data.message)
		}
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				padding: '20px',
				backgroundColor: '#f0f0f0',
				borderRadius: '10px',
				boxShadow: '0 0 10px rgba(0,0,0,0.1)',
			}}
		>
			<Error message={error} />
			<Notification message={notification} />

			<h3 style={{ marginBottom: '20px' }}>Создать обращение</h3>

			<select
				value={id_category}
				onChange={e => setCategory(e.target.value)}
				style={{
					padding: '10px',
					width: '100%',
					maxWidth: '300px',
					marginBottom: '15px',
					borderRadius: '5px',
					border: '1px solid #ccc',
				}}
			>
				<option value='' disabled>
					Выберите категорию
				</option>
				{category.map(category => (
					<option key={category.id} value={category.id}>
						{category.name}
					</option>
				))}
			</select>

			<textarea
				value={description}
				onChange={e => setDescription(e.target.value)}
				rows='4'
				cols='50'
				placeholder='Опишите вашу проблему...'
				style={{
					padding: '10px',
					width: '100%',
					maxWidth: '300px',
					marginBottom: '15px',
					borderRadius: '5px',
					border: '1px solid #ccc',
				}}
			/>

			<button
				type='button'
				onClick={handleTask}
				style={{
					padding: '10px 20px',
					backgroundColor: '#007bff',
					color: 'white',
					border: 'none',
					borderRadius: '5px',
					cursor: 'pointer',
				}}
			>
				Отправить обращение
			</button>
		</div>
	)
}

export default TaskPage
