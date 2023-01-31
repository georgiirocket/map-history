import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { BtnMenuProps } from '../../interface/interface_default';

type handleCloseType = () => void

export const BtnMenu: React.FC<BtnMenuProps> = ({
    data,
    fullWidth = false,
    variant = "contained",
    menuTitle = "Menu",
    startIcon = undefined,
    endIcon = undefined,
    size = "medium",
    sx = {}
}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (f?: handleCloseType | undefined): void => {
        setAnchorEl(null);
        if (f) {
            f()
        }
    };

    return (
        <div>
            <Button
                sx={sx}
                size={size}
                startIcon={startIcon}
                endIcon={endIcon}
                variant={variant}
                fullWidth={fullWidth}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {menuTitle}
            </Button>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose()}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {data.map((d, index) => {
                    return (
                        <MenuItem
                            key={"bnt-nav" + index.toString()}
                            onClick={() => handleClose(d.handler)}
                        >{d.title}</MenuItem>
                    )
                })}
            </Menu>
        </div>
    );
}