import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import Layout from "./panel/Layout";
import NotFound from "./pages/NotFound";
import Home from "./panel/Home";

function Rutas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/panel/*" element={<Layout />}>
                    <Route path="lista" element={<Home />} /> 
                </Route>
                
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Rutas;

