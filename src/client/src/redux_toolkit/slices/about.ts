import { createSlice } from '@reduxjs/toolkit';
import { AboutInit } from '../../interface/interface_default'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: AboutInit = {
    openBox: 'panel1',
    scrollMemory: 0
};

const aboutSlice = createSlice({
    name: 'about',
    initialState,
    reducers: {
        setBox: (state, actions: PayloadAction<string | false>) => {
            state.openBox = actions.payload
        },
        setScrollMemory: (state, actions: PayloadAction<number>) => {
            state.scrollMemory = actions.payload
        }
    },
});


export const aboutActions = aboutSlice.actions;
export const aboutSliceReducer = aboutSlice.reducer;