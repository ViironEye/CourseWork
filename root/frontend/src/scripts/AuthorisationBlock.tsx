import React from "react";
import './AuthorisationBlock.css';

type Props = {};

function AuthorisationBlock()
{
    return (
        <body>
            <div className="AuthorisationButtons">
                <button className="RegisterButton Button">
                    Зарегистрироваться
                </button>
                <button className="EntireButton Button">
                    Войти
                </button>
            </div>
        </body>
    );
}

export default AuthorisationBlock;