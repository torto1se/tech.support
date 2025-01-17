import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Error from "./Error";
import Notification from "./Notification";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 
    const [notification, setNotification] = useState('');

    const styles = {
        input: {
            outline: "none",
            border: 'none',
            borderBottom: '1px solid black',
            paddingBottom: '5px',
            paddingLeft: '0px',
            marginBottom: '15px',
            width: '200px',
        }
    };

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Все поля должны быть заполнены!');
            setTimeout(() => setError(''), 3000)
            return
        }

        const response = await fetch('http://localhost:3001/login', {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            setNotification('Вы успешно вошли!');
            setTimeout(() => setNotification(''), 3000);
            setError('');
            navigate('/task');
        }
    }


    return ( 
        <div>
            <Error message={error} /> 
            <Notification message={notification} />
            <div style={{
                    width:"100%", 
                    justifyContent:"center", 
                    display:"flex", 
                    alignItems:"center", 
                    height:"100vh"
            }}>
                <div style={{
                        border: '2px solid black', 
                        borderRadius:'10px'
                }}>
                    <div style={{
                            gap:"2px", 
                            display:"flex", 
                            flexDirection:"column", 
                            width: "300px", 
                            margin:'40px', 
                            alignItems:'center'
                    }}>
                        <h3 style={{
                                textAlign:"center", 
                                color:"green",  
                                marginBottom:'40px'
                        }}>
                            Авторизация
                        </h3>
                        <input type="text" placeholder="Email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Пароль" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button 
                            type="button" 
                            onClick={handleLogin} 
                            style={{
                                marginTop:"10px", 
                                cursor:'pointer', 
                                color:'white', 
                                backgroundColor:'black', 
                                border: 'none', 
                                padding:'10px', 
                                borderRadius:'10px', 
                                width:'180px'
                        }}>
                            Войти
                        </button>
                        <p style={{textAlign:'center'}}>
                            Нет аккаунта?&nbsp;
                            <Link 
                                to="/registration" 
                                style={{
                                    textDecoration:'none', 
                                    color:"black"
                            }}> 
                                Зарегистрироваться 
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default LoginPage;