import React from "react"
import { Route, Routes, Link } from "react-router-dom"
import './App.css';
import AuthorisationBlock from "./AuthorisationBlock";
import Register from "./Register";
import Realties from "./Realties";
import Entire from "./Entire";

export default function App()
{
    return (<>
        <header>
            <title>Homepage</title>
        </header>
        <body>
            <div className="head">
                <h1 className='headText'>
                    Агентство недвижимости "Лубяночка"
                </h1>
            </div>
        </body>
        <Routes>
            <Route path="/" element={<AuthorisationBlock />}/>
            <Route path="/register" element={<Register />} />
            <Route path="/realties" element={<Realties />} />
            <Route path="/entire" element={<Entire />} />
        </Routes>
    </>)
}