import React from 'react';
import Layout from './layout';
import Map from './components/map';
import Login from './pages/login';

import {
    BrowserRouter,
    Routes,
    Route,

} from "react-router-dom";

function App() {
    return (
        <Layout>
            <BrowserRouter>
                <Routes>
                    <Route path="/map" element={<Map />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/convoys" element={<Login />} />
                    <Route path="/convoys/:convoyId" element={<Login />} />
                </Routes>
            </BrowserRouter>

        </Layout>
    );
}

export default App;
