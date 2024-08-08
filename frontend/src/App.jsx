import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import Notification from "./pages/notification/Notification";
import Profile from "./pages/profile/Profile";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className='flex max-w-6xl mx-auto'>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/notifications' element={<Notification />} />
          <Route path='/profile/:username' element={<Profile />} />
        </Routes>
        <RightPanel />
      </BrowserRouter>

      <Toaster />
    </div>
  );
}

export default App