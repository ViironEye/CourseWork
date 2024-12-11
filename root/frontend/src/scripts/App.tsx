import React from "react"
import { Route, Routes, Link } from "react-router-dom"
import './App.css';
import AuthorisationBlock from "./AuthorisationBlock";
import Register from "./Register";
import Realties from "./Realties";
import Entire from "./Entire";

async function sendData() 
{
    const data = { name: "AAA", lastname: "BBBBBBB", phoneNumber: "+0", email: "56", login: "as", passwordHash: "998" };
    
    try 
    {
        const response = await fetch("http://localhost:5264/backend/client", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok)
        {
            throw new Error("HTTP error: ${response.status}");
        }

        const result = await response.json();

        console.log(result);
    } 
    catch (error) 
    {
        console.error("Error sending: ", error);
    }
}

export default function App()
{
    return (<>
        <header>
            <title>Homepage</title>
        </header>
        <body>
            <script src="api-client.js"/>
            
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