import React from 'react'
import Sidebar from './common/Sidebar'
import { Outlet } from 'react-router-dom'
import RightPanel from './common/RightPanel'

const Layout = () => {
    return (
        <>
            <Sidebar />
            <Outlet />
            <RightPanel />
        </>
    )
}

export default Layout
