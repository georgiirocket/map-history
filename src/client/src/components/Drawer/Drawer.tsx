import React, { useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MapIcon from '@mui/icons-material/Map';
import InfoIcon from '@mui/icons-material/Info';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

import { useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import { useAppSelector, useActions } from '../../hooks/useRedux'
import { config } from '../../config/default'
import { RequestContext } from '../../providers/Request'

type Anchor = 'top' | 'left' | 'bottom' | 'right';

export const LeftDrawer: React.FC = () => {
  const globalState = useAppSelector((state) => state.global)
  const { navBarTougle } = useActions()
  const request = useContext(RequestContext)
  let navigate = useNavigate()
  const { t } = useTranslation()
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  })


  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }
        navBarTougle()
      };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem onClick={() => navigate(config.routes.map)} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <MapIcon />
            </ListItemIcon>
            <ListItemText primary={t('drawer.map')} />
          </ListItemButton>
        </ListItem>
        <ListItem onClick={() => navigate(config.routes.about)} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary={t('drawer.about')} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {!globalState.isAuth ? (
          <>
            <ListItem onClick={() => navigate(config.routes.signIn)} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary={t('drawer.signIn')} />
              </ListItemButton>
            </ListItem>
            <ListItem onClick={() => navigate(config.routes.register)} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <HowToRegIcon />
                </ListItemIcon>
                <ListItemText primary={t('drawer.register')} />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem onClick={() => { request.exit() }} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={t('drawer.signOut')} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
      <Divider />
      <List>
        <ListItem onClick={() => navigate(config.routes.support)} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ContactSupportIcon />
            </ListItemIcon>
            <ListItemText primary={t('drawer.support')} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  useEffect(() => {
    globalState.navBar ? setState(prevState => ({ ...prevState, left: true })) : setState(prevState => ({ ...prevState, left: false }))
  }, [globalState.navBar])
  return (
    <div>
      {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}