import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet'
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import SettingsAccessibilityIcon from '@mui/icons-material/SettingsAccessibility';

import { config } from "../../config/default";
import { MarkerPosition, TowardsPosition } from '../../interface/interface_default'
import { useAppSelector, useActions } from "../../hooks/useRedux";
import { useCustomMarker } from "../../hooks/useCustomMarker";
import { useTranslation } from "react-i18next";
import '../../sass/_leaflet.scss'

let privateMap: any | null = null
let timeoutId: null | ReturnType<typeof setTimeout> = null
export const Leaflet: React.FC = () => {
    const { myLocalPosition, createMarkerMod, addMarkerPosition, stopPosition } = useAppSelector(state => state.map)
    const globalState = useAppSelector((state) => state.global)
    const { setMyLocalPosition, setAddMarker, setStopPosition, setMapRightBar } = useActions()
    const { customIconMarker } = useCustomMarker()
    const { t } = useTranslation()
    const navigate = useNavigate()

    const towardsSavedPosition = ((): TowardsPosition => {
        if (addMarkerPosition) {
            return ({
                position: [addMarkerPosition.latLng.lat, addMarkerPosition.latLng.lng],
                zoom: addMarkerPosition.zoom
            })
        }
        if (stopPosition) {
            return ({
                position: [stopPosition.latLng.lat, stopPosition.latLng.lng],
                zoom: stopPosition.zoom
            })
        }
        return ({ position: [0, 0], zoom: 4 })
    })()

    const test = () => {
        if (privateMap) {
            privateMap.closePopup()
        }
        setMapRightBar("right")
        navigate(config.routes.marker + "/new")
    }

    const MyComponent = () => {
        const map = useMapEvents({
            click: (e) => {
                if (createMarkerMod) {
                    setAddMarker({
                        latLng: {
                            lat: e.latlng.lat,
                            lng: e.latlng.lng
                        },
                        zoom: map.getZoom()
                    })
                }
                // console.log('containerPoint:', e.containerPoint)
                // console.log('latlng:', e.latlng)
                // setPositions(prevState => [...prevState, [e.latlng.lat, e.latlng.lng]])
                // map.locate()
                // map.flyTo(e.latlng, map.getZoom())
            },
            locationfound(e) {
                setMyLocalPosition([e.latlng.lat, e.latlng.lng])
                map.flyTo(e.latlng, map.getZoom())
            },
        })
        privateMap = map
        useEffect(() => {
            const onMove = () => {
                if (timeoutId) {
                    clearTimeout(timeoutId)
                }
                timeoutId = setTimeout(() => {
                    setStopPosition({
                        latLng: {
                            lat: map.getCenter().lat,
                            lng: map.getCenter().lng
                        },
                        zoom: map.getZoom()
                    })
                }, 500)
            }
            map.on('move', onMove)
            const onLocationError = (e: any) => {
                alert(e?.message);
            }

            map.on('locationerror', onLocationError);
            return () => {
                map.off('move', onMove)
                map.off('locationerror', onLocationError)
            }
        }, [map])
        return null
    }
    return (
        <MapContainer
            className="leaflet-custom"
            style={{ height: '100%', width: '100%' }}
            center={towardsSavedPosition.position} zoom={towardsSavedPosition.zoom} >
            <TileLayer
                attribution='&amp;copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* {state.markers.map(m => (
                    <Marker key={`mar${m[0]}_${m[1]}`} position={m} icon={customIconMarker.basic()} >
                        <Popup href="kdckdc" className="popup_theme">
                            <div style={{ width: '150px', height: '250px' }}>
                                Hello Stas!!!!
                            </div>
                        </Popup>
                    </Marker>
                ))} */}
            <MyComponent />
            {myLocalPosition ? (
                <Marker position={myLocalPosition} icon={customIconMarker.mylocation()}>
                    <Popup className="popup_theme">You are here!!!</Popup>
                </Marker>) : false}
            {addMarkerPosition && globalState.isAuth && (<Marker position={addMarkerPosition.latLng} icon={customIconMarker.edit()}>
                <Popup className="popup_theme"><Button size="small" onClick={test} >{t("mapPage.createMarker")}</Button></Popup>
            </Marker>)}
            {/* {state.clickPosition ? (<Marker position={state.clickPosition} icon={customIconMarker.edit()}>
                    <Popup className="popup_theme">
                        <Button size="small" variant="outlined" startIcon={<AddLocationIcon />}>
                            Create
                        </Button>
                    </Popup>
                </Marker>) : false} */}
        </MapContainer>
    )
}
export function getCenter(positions: MarkerPosition, zoom: number): void {
    if (privateMap) {
        privateMap.flyTo(positions, zoom ? zoom : privateMap.getZoom())
    }
}
export function getMyLocation() {
    if (privateMap) {
        privateMap.locate()
    }
}