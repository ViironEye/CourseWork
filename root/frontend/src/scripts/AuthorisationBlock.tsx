import React from "react";
import './AuthorisationBlock.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from './Register';
import MainHeader from "./MainHeader";

function AuthorisationBlock()
{
    return (
        <body>
            <div className="AuthorisationButtons">
                {/* <Router>
                    <Routes>
                        <Route path="/"/>   
                        <Route path="/Register" element={<Register/>} />
                    </Routes>
                </Router> */}

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