import React from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { TypeOptions } from '../../interface/interface_default';
import { useTranslation } from 'react-i18next';
import { themeApp } from '../../styles/_default';
import { PicturesWithLoad } from '../PicturesWithLoad/PicturesWithLoad';
import '../../sass/_photo_card.scss'

interface LogMenu {
    disabledMenu?: boolean,
    options: TypeOptions[],
    specialFilter?: (p: TypeOptions[]) => TypeOptions[]
}

interface PropsPhotoCard extends LogMenu {
    active: boolean,
    src: string
}

export const PhotoCard: React.FC<PropsPhotoCard> = ({ active, src, disabledMenu = false, options, specialFilter }) => {
    const { t } = useTranslation()
    return (
        <Card className='photo-card-container' sx={{ maxWidth: 345 }}>
            <PicturesWithLoad src={src} styleImg={{ objectFit: "cover" }} />
            <CardContent className='c-content'>
                <div className='left'>
                    <CheckCircleIcon sx={active ? { color: themeApp.ORANGE_COLOR } : {}} />
                    <Typography sx={{ margin: 0 }} variant="overline" display="block" gutterBottom>
                        {active ? t("photoCard.isUse") : t("photoCard.notUse")}
                    </Typography>
                </div>
                <LongMenu
                    disabledMenu={disabledMenu}
                    options={options}
                    specialFilter={specialFilter}
                />
            </CardContent>
        </Card>
    );
}

function LongMenu({ disabledMenu, options, specialFilter }: LogMenu) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const s_filter = specialFilter ? specialFilter : (p: TypeOptions[]): TypeOptions[] => p

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
                {s_filter(options).map((option) => {
                    return (
                        <MenuItem disabled={disabledMenu} key={option[0]} onClick={() => option[2]()}>
                            {option[0]}
                        </MenuItem>
                    )
                })}
            </Menu>
        </div>
    );
}