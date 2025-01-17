import { useState } from "react";
import { Link } from "react-router-dom";
import Error from "./Error";
import Notification from "./Notification";

function RegistrationPage() {
    const [full_name, setFullname] = useState('');
    const[id_department, setDepartment] = useState('');
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
        },
        option: {
            paddingLeft:'0px', 
            marginLeft:'0px',
        }
    };

    const handleRegister = async () => {
        if (!full_name || !id_department || !phone || !email || !password) {
            setError('Все поля должны быть заполнены!');
            setTimeout(() => setError(''), 3000)
            return
        }

        const response = await fetch('http://localhost:3001/registration', {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({full_name, id_department, phone, email, password})
        });

        const data = await response.json();
        if (response.ok) {
            setNotification('Регистрация прошла успешно!');
            setTimeout(() => setNotification(''), 3000);
            setError('');
        } else {
            setError(data.error);
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
                            Регистрация
                        </h3>
                        <input type="text" placeholder="ФИО" style={styles.input} value={full_name} onChange={(e) => setFullname(e.target.value)} />
                        <select value={id_department} onChange={(e) => setDepartment(e.target.value)} style={{width:'202px', padding:'5px', outline:'none', border:'none', color: id_department ? 'black' : 'gray', borderBottom:'1px solid black', marginBottom:'15px', marginLeft:'0px', paddingLeft:'0px', backgroundColor:'#FFFFFF'}}>
                            <option style={styles.option} value="" disabled selected>Выберите отдел</option>
                            <option style={styles.option} value={1}>Отдел продаж</option>
                            <option style={styles.option} value={2}>Отдел ремонта</option>
                        </select>
                        <input type="tel" placeholder="Телефон" style={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <input type="text" placeholder="Email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Пароль" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button 
                            type="button" 
                            onClick={handleRegister} 
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
                            Зарегистрироваться
                        </button>
                        <p style={{textAlign:'center'}}>
                            Уже есть аккаунт?&nbsp;
                            <Link 
                                to="/login" 
                                style={{
                                    textDecoration:'none', 
                                    color:"black"
                            }}> 
                                Войти 
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default RegistrationPage;