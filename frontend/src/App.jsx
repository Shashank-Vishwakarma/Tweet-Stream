import React from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import Notification from "./pages/notification/Notification";
import Profile from "./pages/profile/Profile";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/authContext";
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Layout from "./components/Layout";

function App() {
  const { user } = useAuthContext();

  return (
    <div className='flex max-w-6xl mx-auto'>
      <BrowserRouter>
        {/* <Sidebar /> */}
        <Routes>
          <Route path='/' element={user ? <Layout /> : <Navigate to={'/login'} />} >
            <Route path="" element={user ? <Home /> : <Navigate to={'/login'} />} />
            <Route path='/notifications' element={user ? <Notification /> : <Navigate to={'/login'} />} />
            <Route path='/profile/:username' element={user ? <Profile /> : <Navigate to={'/login'} />} />
          </Route>

          <Route path='/signup' element={user ? <Navigate to={'/'} /> : <SignUp />} />
          <Route path='/login' element={user ? <Navigate to={'/'} /> : <Login />} />
        </Routes>
        {/* <RightPanel /> */}
      </BrowserRouter>

      <Toaster />
    </div>
  );
}

export default App