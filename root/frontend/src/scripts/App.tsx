import React from "react"
import axios from "axios";
import './App.css';
//import './api-scripts/api-getClient';
import AppRoutes from "./AppRoutes";

async function fetchClient(_login: string, _password: string, _email: string)
{
    const query = new URLSearchParams({ 
        login: _login, 
        passwordHash: _password, 
        email: _email 
    });
// ${API_ENDPOINTS.API_URL_CHANGABLE}client?${query.toString()}
        const response = await fetch('http://localhost:5264/backend/client?${query.toString()}', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        
        response.then(response => {
            if(!response.ok)
                {
                    throw new Error('HTTP error: ${response.status}');
                }
                
                data.forEach((post: {id: string}) => {console.log(post.id)});
            return data;
    }).catch(error =>{
        console.log(error, 'error');
    })
    
}



export default function App()
{
    fetchClient("as", "998", "56").then(data =>{console.log(data)})
    return (<>
        <header>
            <title>Homepage</title>
        </header>
        <div>
            <div className="head">
                <script src="api-client.js"/>
                <h1 className='headText'>
                    Агентство недвижимости "Лубяночка"
                </h1>
            </div>
        </div>
        <AppRoutes/>
    </>)
}