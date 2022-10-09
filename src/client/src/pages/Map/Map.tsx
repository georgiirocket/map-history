import React from 'react'
import { AlertMap } from '../../components/AlertMap/AlertMap'
import { InfoBtn } from '../../components/InfoBtn/InfoBtn'
import { Leaflet } from '../../components/Leaflet/Leaflet'
import { MapBar } from '../../components/MapBar/MapBar'
import { MapRightBar } from '../../components/MapRightBar/MapRightBar'
import { useAppSelector, useActions } from '../../hooks/useRedux'
import { useTranslation } from 'react-i18next'
import '../../sass/_map.scss'


export const Map: React.FC = () => {
    const { createMarkerMod, mapBar, mapRightBar } = useAppSelector(state => state.map)
    const { setAlertMap } = useActions()
    const { t } = useTranslation()
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