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
        setMarkerTitle: (state, action: PayloadAction<string>) => {
            state.dataMarker.title = action.payload
        },
        setMarkerDescription: (state, action: PayloadAction<string>) => {
            state.dataMarker.description = action.payload
        },
    },
});


export const mapActions = mapSlice.actions;
export const mapSliceReducer = mapSlice.reducer;