import { createSlice } from '@reduxjs/toolkit';
import { SupportInit } from '../../interface/interface_default'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: SupportInit = {
    miniPage: 0,
    topic: ''
};

const supportSlice = createSlice({
    name: 'support',
    initialState,
    reducers: {
        nextMiniPage: (state) => {
            state.miniPage = state.miniPage !== 2 ? state.miniPage + 1 : 0
        },
        backMiniPage: (state) => {
            state.miniPage -= 1
        },
        currentMiniPage: (state, action: PayloadAction<number>) => {
            state.miniPage = action.payload
        },
        setTopic: (state, action: PayloadAction<string>) => {
            state.topic = action.payload
        }
    },
});

export const supportActions = supportSlice.actions;
export const supportReducer = supportSlice.reducer;