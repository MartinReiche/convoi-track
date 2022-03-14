import React from 'react';
import Layout from './layout';
import Login from './pages/login';
import RequireAuth from "./components/gates/requireAuth";
import RequireUnauth from "./components/gates/requireUnauth";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/home";
import NotFound from "./pages/notFound";
import AuthProvider from "./components/auth/authProvider";
import NewConvoi from "./pages/newConvoi";
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdminDashboard from "./pages/adminDashboard";

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
                                    <RequireAuth roles={['project-admin', 'admin', 'orga', 'driver']}>
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
                                       <RequireAuth roles={['project-admin', 'admin', 'orga', 'driver']}>
                                           <NewConvoi/>
                                       </RequireAuth>
                                   }
                            />
                            <Route path="/convoys/:id"
                                   element={
                                       <RequireAuth roles={['project-admin', 'admin', 'orga', 'driver']}>
                                           <div>
                                               Convoi Page
                                           </div>
                                       </RequireAuth>
                                   }
                            />
                            <Route path="/fixtures"
                                   element={
                                       <RequireAuth roles={['admin']}>
                                          <AdminDashboard />
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
