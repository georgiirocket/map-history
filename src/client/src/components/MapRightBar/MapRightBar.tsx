import React from "react";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Route, Routes } from 'react-router-dom'

import { config } from "../../config/default";
import { useAppSelector, useActions } from "../../hooks/useRedux";
import { DefaultMap } from "../../pages_incuded/DefaultMap/DefaultMap";
import { MarkerInfo } from "../../pages_incuded/MarkerInfo/MarkerInfo";
import '../../sass/_maprightbar.scss'


export const MapRightBar: React.FC = () => {
    const { mapRightBar } = useAppSelector(state => state.map)
    const { setMapRightBar } = useActions()

    if (mapRightBar === "hide") {
        return (
            <div onClick={() => setMapRightBar("right")} className="map-r-b-container">
                <ArrowLeftIcon />
            </div>
        )
    }
    return (
        <div className="map-r-b-container">
            <Routes>
                <Route path={config.routes.marker + "/:id"} element={<MarkerInfo />} />
                <Route path="*" element={<DefaultMap />} />
            </Routes>
        </div>
    )
}
