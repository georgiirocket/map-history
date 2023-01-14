import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertMap } from '../../components/AlertMap/AlertMap'
import { InfoBtn } from '../../components/InfoBtn/InfoBtn'
import { Leaflet } from '../../components/Leaflet/Leaflet'
import { MapBar } from '../../components/MapBar/MapBar'
import { MapRightBar } from '../../components/MapRightBar/MapRightBar'
import { useAppSelector, useActions } from '../../hooks/useRedux'
import { useTranslation } from 'react-i18next'
import { config } from '../../config/default'
import '../../sass/_map.scss'


export const Map: React.FC = () => {
    const { createMarkerMod, mapBar, mapRightBar, lastlocation } = useAppSelector(state => state.map)
    const { setAlertMap, setMapLastLocation } = useActions()
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        if (location.pathname !== config.routes.map) {
            setMapLastLocation(location.pathname)
        }
    }, [location.pathname])
    useEffect(() => {
        if (lastlocation) {
            navigate(lastlocation)
        }
    }, [])
    return (
        <div
            data-right-bar={mapRightBar}
            data-mapbar={mapBar ? 'open' : 'close'}
            className='map-page'>
            {createMarkerMod && <InfoBtn onClick={() => setAlertMap(t("mapPage.infoCreateMarker"))} />}
            <AlertMap onClose={() => setAlertMap('')} />
            <Leaflet />
            <MapBar />
            <MapRightBar />
        </div>
    )
}