import { Route, Routes} from "react-router-dom";
import AuthorisationBlock from "./AuthorisationBlock";
import Register from "./Register";
import Realties from "./Realties";
import Entire from "./Entire";

export default function AppRoutes()
{
    return ( 
    <Routes>
        <Route path="/" element={<AuthorisationBlock />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/realties" element={<Realties />} />
        <Route path="/entire" element={<Entire />} />
    </Routes>
    )
}