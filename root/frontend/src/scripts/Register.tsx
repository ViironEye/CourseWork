import React from "react";
import './Register.css';
import { Link } from "react-router-dom";

export default function Register() 
{
    return (
        <body>
            <div className="registerMainScreen">
                <div className="registerInputs">
                    <input className="registerInput" placeholder="Логин"/>
                    <input className="registerInput" placeholder="E-mail" />
                    <input className="registerInput" placeholder="Пароль" />
                    <Link className="registerOk" to="/realties" >
                        Зарегистрироваться
                    </Link>
                </div>
            </div>
        </body>
    );
}