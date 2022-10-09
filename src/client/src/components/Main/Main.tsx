import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { config } from '../../config/default'
import { Map } from '../../pages/Map/Map'
import { Register } from '../../pages/Register/Register'
import { SignIn } from '../../pages/SignIn/SignIn'
import { About } from '../../pages/About/About'
import { Support } from '../../pages/Support/Support'
import { Profile } from '../../pages/Profile/Profile'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { useAppSelector, useActions } from '../../hooks/useRedux'
import '../../sass/_main.scss'

export const Main: React.FC = () => {
    const globalState = useAppSelector((state) => state.global)
    const { navBarTougle } = useActions()
    return (
        <div className='main-box'>
            <Routes>
                <Route path={config.routes.map} element={<Map />} />
                <Route path={config.routes.about} element={<About />} />
                <Route path={config.routes.support} element={<Support />} />
                {!globalState.isAuth ? (
                    <>
                        <Route path={config.routes.register} element={<Register />} />
                        <Route path={config.routes.signIn} element={<SignIn />} />
                    </>
                ) : (
                    <>
                        <Route path={config.routes.profile} element={<Profile />} />
                    </>
                )}
                <Route path="*" element={<Map />} />
            </Routes>
            <IconButton onClick={navBarTougle} className='btn-mini-screen' aria-label="delete">
                <MenuIcon />
            </IconButton>
        </div>
    )
}