import { renderToStaticMarkup } from 'react-dom/server'
import { divIcon } from "leaflet"
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { themeApp } from '../styles/_default';
import "../sass/_marker.scss"

const DEF_STYLE = {
    width: '100%',
    height: '100%',
    color: themeApp.ORANGE_COLOR
}

export const useCustomMarker = () => {
    const iconMarkup = renderToStaticMarkup(
        <MyLocationIcon style={{ ...DEF_STYLE, color: themeApp.SOFT_RED_COLOR }}
        />
    );
    const iconAddLocation = renderToStaticMarkup(
        <AddLocationAltIcon className='add-marker' style={DEF_STYLE} />
    )
    const customIconMarker = {
        basic: () => {
            return divIcon({
                html: iconMarkup,
                iconSize: [40, 40],
                className: 'custom-marker'
            })
        },
        mylocation: () => {
            return divIcon({
                html: iconMarkup,
                iconSize: [40, 40],
                className: 'custom-marker'
            })
        },
        edit: () => {
            return divIcon({
                html: iconAddLocation,
                iconSize: [40, 40],
                className: 'custom-marker'
            })
        },
    }
    return { customIconMarker }
}