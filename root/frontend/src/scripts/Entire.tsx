import React from "react";
import { Link } from "react-router-dom";
import "./Entire.css";

export default function Entire()
{
    return (
        <body>
            <div className="entireMainScreen">
                <div className="entireInputs">
                    <input className="entireInput" placeholder="Логин"/>
                    <input className="entireInput" placeholder="Пароль"/>
                    <Link className="entireOk" to="/realties" >
                        Войти
                    </Link>
                </div>
            </div>
        </body>
    );
}