import React, { useState } from 'react';
import Zoom from 'react-medium-image-zoom'

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Skeleton from '@mui/material/Skeleton';

import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../hooks/useRedux';
import { themeApp } from '../../styles/_default';
import '../../sass/_photo_card.scss'

interface LogMenu {
    active: boolean,
    disabledMenu?: boolean,
    remove: () => void,
    use: () => void
    unUse: () => void
}

interface PropsPhotoCard extends LogMenu {
    active: boolean,
    src: string
}

export const PhotoCard: React.FC<PropsPhotoCard> = ({ active, src, disabledMenu = false, remove, use, unUse }) => {
    const [loaded, setLoaded] = useState<boolean>(true)
    const [loadedError, setLoadedError] = useState<boolean>(false)
    const { t } = useTranslation()
    const { theme } = useAppSelector(state => state.global)
    return (
        <Card className='photo-card-container' sx={{ maxWidth: 345 }}>
            <div className='ph-box'>
                <Zoom overlayBgColorEnd={theme === 'light' ? themeApp.WHITE_COLOR : themeApp.DARK_BACKGROUND}>
                    <img
                        alt="that wanaka tree"
                        src={src}
                        onLoad={() => setLoaded(false)}
                        onError={() => setLoadedError(true)}
                        width="345"
                        height="345"
                    />
                </Zoom>
                {loaded || loadedError ? (
                    <Skeleton className='sckell' variant="rectangular" width="100%" height="100%">
                        {loadedError ? "Sorry, can't get picture" : ""}
                    </Skeleton>
                ) : false}
            </div>
            <CardContent className='c-content'>
                <div className='left'>
                    <CheckCircleIcon sx={active ? { color: themeApp.ORANGE_COLOR } : {}} />
                    <Typography sx={{ margin: 0 }} variant="overline" display="block" gutterBottom>
                        {active ? t("photoCard.isUse") : t("photoCard.notUse")}
                    </Typography>
                </div>
                <LongMenu disabledMenu={disabledMenu} remove={remove} use={use} active={active} unUse={unUse} />
            </CardContent>
        </Card>
    );
}

function LongMenu({ remove, use, unUse, active, disabledMenu }: LogMenu) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { t } = useTranslation()
    const options = [[t("photoCard.btn.use"), 'u'], [t("photoCard.btn.unUse"), 'un'], [t("photoCard.btn.remove"), 'r']];
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (action: string) => {
        setAnchorEl(null);
        if (action === 'r') {
            remove()
        } else if (action === 'un') {
            unUse()
        } else {
            use()
        }
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
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
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    style: {
                        maxHeight: 48 * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {options.filter(o => active ? o[1] !== 'u' : o[1] !== 'un').map((option) => {
                    return (
                        <MenuItem disabled={disabledMenu} key={option[0]} onClick={() => handleClose(option[1])}>
                            {option[0]}
                        </MenuItem>
                    )
                })}
            </Menu>
        </div>
    );
}