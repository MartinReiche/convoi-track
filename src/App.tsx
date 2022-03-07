import React from 'react';
import Layout from './layout';
import Map from './components/map';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import RequireAuth from "./components/gates/requireAuth";
import RequireUnauth from "./components/gates/requireUnauth";

import {
    BrowserRouter,
    Routes,
    Route,

} from "react-router-dom";
import Home from "./pages/home";

function App() {
    return (
        <Layout>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<RequireAuth roles={['admin']}><Home /></RequireAuth>} />
                    <Route path="/dashboard" element={<RequireAuth roles={['admin']}><Dashboard /></RequireAuth>} />
                    <Route path="/login" element={<RequireUnauth><Login/></RequireUnauth>} />
                    <Route path="/map" element={<Map />} />
                </Routes>
            </BrowserRouter>

        </Layout>
    );
}

export default App;
