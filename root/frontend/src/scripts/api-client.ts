import axios from "axios";

const API_URL = "http://localhost:5264";

export default async function fetchData() 
{    
    try
    {

        const response = await axios.get('${API_URL}/data');

        console.log("Response from backend: ", response.data);

        return response.data;
    } catch (error)
    {
        console.error("Error fetching data", error);
    }
} 