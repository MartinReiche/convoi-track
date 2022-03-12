import React from 'react';
import Layout from './layout';
import Login from './pages/login';
import RequireAuth from "./components/gates/requireAuth";
import RequireUnauth from "./components/gates/requireUnauth";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/home";
import NotFound from "./pages/notFound";
import Map from "./components/map";
import AuthProvider from "./components/auth/authProvider";
import NewConvoi from "./pages/newConvoi";
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from "@mui/lab/LocalizationProvider";

function App() {
    return (
        <LocalizationProvider dateAdapter={DateAdapter}>
            <AuthProvider>
                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path='*' element={<NotFound/>}/>
                            <Route
                                path="/"
                                element={
                                    <RequireAuth roles={['admin', 'orga', 'driver']}>
                                        <Home/>
                                    </RequireAuth>
                                }
                            />
                            <Route
                                path="/login"
                                element={
                                    <RequireUnauth>
                                        <Login/>
                                    </RequireUnauth>
                                }
                            />
                            <Route path="/convoys/new"
                                   element={
                                       <RequireAuth roles={['admin', 'orga', 'driver']}>
                                           <NewConvoi />
                                       </RequireAuth>
                                   }
                            />
                            <Route path="/convoys/:id"
                                   element={
                                       <RequireAuth roles={['admin', 'orga', 'driver']}>
                                           <Map/>
                                       </RequireAuth>
                                   }
                            />
                        </Routes>
                    </Layout>
                </BrowserRouter>
            </AuthProvider>
        </LocalizationProvider>
    );
}

export default App;
