import React from "react";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import AppsIcon from '@mui/icons-material/Apps';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { v4 } from 'uuid';

import { useAppSelector, useActions } from "../../hooks/useRedux";
import '../../sass/_contentrightbar.scss'

interface btnProps {
    title: string,
    handler: () => void,
    icon?: React.ReactNode
}

interface ContentRightBarProps {
    title?: string,
    children?: React.ReactNode,
    navigates?: btnProps[]
}

interface AppMenu {
    navigates: btnProps[]
}

export const ContentRightBar: React.FC<ContentRightBarProps> = ({ title = 'Name block', children, navigates }) => {
    const { mapRightBar } = useAppSelector(state => state.map)
    const { setMapRightBar } = useActions()
    return (
        <div className="mrb-content">
            <div className="t-content">
                <div className="n-block">
                    <Typography noWrap variant="h6">{title}</Typography>
                </div>
                <div className="c-block">
                    {children}
                </div>
            </div>
            <div className="btn-block">
                {mapRightBar === "right" && <OpenInFullIcon className="resize" onClick={() => setMapRightBar("center")} />}
                {mapRightBar === "center" && <CloseFullscreenIcon className="resize" onClick={() => setMapRightBar("right")} />}
                {navigates && navigates.length && <AppMenu navigates={navigates} />}
                <DisabledByDefaultIcon onClick={() => setMapRightBar("hide")} />
            </div>
        </div>
    )
}


function AppMenu({ navigates }: AppMenu) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                style={{ padding: 0 }}
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <AppsIcon />
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
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {navigates.map(n => {
                    if (n.icon) {
                        return (
                            <MenuItem key={v4()} onClick={() => {
                                n.handler()
                                handleClose()
                            }}>
                                <ListItemIcon>
                                    {n.icon}
                                </ListItemIcon>
                                <Typography noWrap variant="inherit">{n.title}</Typography>
                            </MenuItem>
                        )
                    }
                    return (
                        <MenuItem key={v4()} onClick={() => {
                            n.handler()
                            handleClose()
                        }}>
                            <Typography noWrap variant="inherit">{n.title}</Typography>
                        </MenuItem>
                    )
                })}
            </Menu>
        </div>
    );
}
