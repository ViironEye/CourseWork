import * as React from "react";
import './AuthorisationBlock.css';
import { Link } from 'react-router-dom';
import Register from './Register';
import Entire from "./Entire"

function AuthorisationBlock()
{
    return (
        <body>
            <div className="AuthorisationButtons">
                <Link to="/register" className="RegisterButton Button">
                    Зарегистрироваться
                </Link>
                <Link to="/entire" className="EntireButton Button">
                    Войти
                </Link>
            </div>
        </body>
    );
}

export default AuthorisationBlock;