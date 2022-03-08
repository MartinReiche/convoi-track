import React from 'react';
import Layout from './layout';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import RequireAuth from "./components/gates/requireAuth";
import RequireUnauth from "./components/gates/requireUnauth";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/home";
import Admin from "./pages/admin";
import Map from "./components/map";

function App() {
    return (
        <Layout>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<RequireAuth roles={['admin']}><Home /></RequireAuth>} />
                    <Route path="/dashboard" element={<RequireAuth roles={['admin']}><Dashboard /></RequireAuth>} />
                    <Route path="/login" element={<RequireUnauth><Login/></RequireUnauth>} />
                    <Route path="/admin" element={<RequireAuth roles={['admin']}><Admin /></RequireAuth>} />
                    <Route path="/map" element={<RequireAuth roles={['admin', 'orga', 'driver']}><Map /></RequireAuth>} />
                </Routes>
            </BrowserRouter>

        </Layout>
    );
}

export default App;
