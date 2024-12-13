import { API_ENDPOINTS } from "./api-endpoints";
import App from "../App";

export default async function fetchClient(_login: string, _password: string, _email: string)
{
    const query = new URLSearchParams({ 
        login: _login, 
        password: _password, 
        email: _email 
    });
// ${API_ENDPOINTS.API_URL_CHANGABLE}client?${query.toString()}
    try
    {
        const response = await fetch('http://localhost:5264/backend/client${query.toString()}', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(query)
        });

        if(!response.ok)
        {
            throw new Error('HTTP error: ${response.status}');
        }

        const result = await response.json();

        console.log(result);
        
    } 
    catch(error)
    {
        console.error('Error sending: ', error);
    }
}