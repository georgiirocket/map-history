import { createSlice } from '@reduxjs/toolkit';
import {
    MapInit,
    MarkerPosition,
    MapRightBar,
    AddMarkerPositionType,
    PayloadActiveMarker,
} from '../../interface/interface_default'
import { MarkerPhotoModel } from '../../models/avatar';
import type { PayloadAction } from '@reduxjs/toolkit'

type SetAddMarker = AddMarkerPositionType | null

const initialState: MapInit = {
    createMarkerMod: false,
    mapBar: true,
    scrollMapBar: 0,
    myLocalPosition: null,
    alertMap: '',
    mapRightBar: "hide",
    addMarkerPosition: null,
    stopPosition: null,
    lastlocation: "",
    activeMarker: {
        photos: []
    },
    dataMarker: {
        photos: [],
        title: "",
        description: "",
        privat: false,
        owner: "",
        markerPosition: null
    }
};

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setCreateMarkerMod: (state, action: PayloadAction<boolean>) => {
            state.createMarkerMod = action.payload
            if (action.payload === false) {
                state.addMarkerPosition = null
            }
        },
        setMapBar: (state, action: PayloadAction<boolean>) => {
            state.mapBar = action.payload
        },
        setScrollMapBar: (state, action: PayloadAction<number>) => {
            state.scrollMapBar = action.payload
        },
        setMyLocalPosition: (state, action: PayloadAction<MarkerPosition | null>) => {
            state.myLocalPosition = action.payload
        },
        setAlertMap: (state, action: PayloadAction<string>) => {
            state.alertMap = action.payload
        },
        setMapRightBar: (state, action: PayloadAction<MapRightBar>) => {
            state.mapRightBar = action.payload
        },
        setAddMarker: (state, action: PayloadAction<SetAddMarker>) => {
            state.addMarkerPosition = action.payload
        },
        setStopPosition: (state, action: PayloadAction<SetAddMarker>) => {
            state.stopPosition = action.payload
        },
        setMapLastLocation: (state, action: PayloadAction<string>) => {
            state.lastlocation = action.payload
        },
        setDataActiveMarker: (state, action: PayloadAction<PayloadActiveMarker>) => {
            state.activeMarker = { ...state.activeMarker, ...action.payload }
        },
        setMarkerPhotos: (state, action: PayloadAction<MarkerPhotoModel[]>) => {
            state.dataMarker.photos = action.payload
        },
        createNewMarkerPhotos: (state, action: PayloadAction<MarkerPhotoModel[]>) => {
            const newPhotos = [...action.payload, ...state.dataMarker.photos]
            if (!newPhotos.find(u => u.activeScreen)) {
                state.dataMarker.photos = newPhotos.map((u, index) => index === 0 ? ({ ...u, activeScreen: true }) : ({ ...u }))
            } else {
                state.dataMarker.photos = newPhotos
            }
        },
        setMarkerTitle: (state, action: PayloadAction<string>) => {
            state.dataMarker.title = action.payload
        },
        setMarkerDescription: (state, action: PayloadAction<string>) => {
            state.dataMarker.description = action.payload
        },
        setMarkerPrivat: (state, action: PayloadAction<boolean>) => {
            state.dataMarker.privat = action.payload
        },
        setActivePhotoMarker: (state, action: PayloadAction<string>) => {
            if (!action.payload) {
                state.dataMarker.photos = state.dataMarker.photos.map(i => ({ ...i, active: false }))
            } else {
                state.dataMarker.photos = state.dataMarker.photos
                    .map(i => i.id === action.payload ? ({ ...i, active: true }) : ({ ...i, active: false }))
            }
        },
        removePhotoMarker: (state, action: PayloadAction<string>) => {
            const newPhoto = state.dataMarker.photos.filter(i => i.id !== action.payload)
            if (newPhoto.length && !newPhoto.find(i => i.activeScreen)) {
                newPhoto[0].activeScreen = true
            }
            state.dataMarker.photos = newPhoto
        },
    },
});


export const mapActions = mapSlice.actions;
export const mapSliceReducer = mapSlice.reducer;