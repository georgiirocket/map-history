import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom'
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import ListItemIcon from '@mui/material/ListItemIcon';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LanguageIcon from '@mui/icons-material/Language';

import { useNavigate } from "react-router-dom"
import { config } from '../../config/default';
import { RequestContext } from '../../providers/Request'
import { useTranslation } from 'react-i18next';
import { NameSpace } from '../NameSpace/NameSpace'
import { SkeletorHidden } from '../SceletorHidden/SkeletorHidden';
import { useAppSelector, useActions } from '../../hooks/useRedux'
import logo from '../../images/logo/logo.svg'
import '../../sass/_navigate.scss'


export const Navigate: React.FC = () => {
    const globalState = useAppSelector((state) => state.global)
    const { navBarTougle, themeTougle } = useActions()
    let navigate = useNavigate()
    const { t } = useTranslation()
    return (
        <div className="nav-conatainer">
            <div className='left'>
                <IconButton onClick={navBarTougle} edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
                    <MenuIcon />
                </IconButton>
                <SkeletorHidden customClass='logo-img' pathImage={[logo]}>
                    <img onClick={() => navigate(config.routes.map)} className='logo-img' alt="map-logo" />
                </SkeletorHidden>
                <Routes>
                    <Route path={`${config.routes.map}/*`} element={<NameSpace text={t('drawer.map')} />} />
                    <Route path={config.routes.register} element={<NameSpace text={t('drawer.register')} />} />
                    <Route path={config.routes.signIn} element={<NameSpace text={t('drawer.signIn')} />} />
                    <Route path={config.routes.profile} element={<NameSpace text={t('navigate.menu.profile')} />} />
                    <Route path={config.routes.about} element={<NameSpace text={t('drawer.about')} />} />
                    <Route path={config.routes.support} element={<NameSpace text={t('drawer.support')} />} />
                    <Route path="*" element={<NameSpace text={t('drawer.map')} />} />
                </Routes>
            </div>
            <div className='right'>
                <IconButton onClick={themeTougle} edge="start" color="inherit" aria-label="theme">
                    {globalState.theme === 'light' ? <NightlightIcon /> : <LightModeIcon />}
                </IconButton>
                <LongMenu />
            </div>
        </div>
    )
}

function LongMenu() {
    const globalState = useAppSelector((state) => state.global)
    const { openDialogLanguage } = useActions()
    let navigate = useNavigate()
    const { t } = useTranslation();
    const request = useContext(RequestContext)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const ITEM_HEIGHT = 48;
    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                style={{ color: 'white' }}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                <MenuItem onClick={() => { openDialogLanguage(true); handleClose(); }}>
                    <ListItemIcon>
                        <LanguageIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="inherit" noWrap>
                        {t('navigate.menu.language')}
                    </Typography>
                </MenuItem>
                {globalState.isAuth ? (
                    <div>
                        <MenuItem onClick={() => { navigate(config.routes.profile); handleClose(); }}>
                            <ListItemIcon>
                                <AccountCircleIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                {t('navigate.menu.profile')}
                            </Typography>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            request.exit();
                            handleClose();
                        }}>
                            <ListItemIcon>
                                <ExitToAppIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                {t('drawer.signOut')}
                            </Typography>
                        </MenuItem>
                    </div>
                ) : (
                    <div>
                        <MenuItem onClick={() => { navigate(config.routes.signIn); handleClose(); }}>
                            <ListItemIcon>
                                <LoginIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                {t('drawer.signIn')}
                            </Typography>
                        </MenuItem>
                        <MenuItem onClick={() => { navigate(config.routes.register); handleClose(); }}>
                            <ListItemIcon>
                                <HowToRegIcon fontSize="small" />
                            </ListItemIcon>
                            <Typography variant="inherit" noWrap>
                                {t('drawer.register')}
                            </Typography>
                        </MenuItem>
                    </div>
                )}
            </Menu>
        </div>
    );
}