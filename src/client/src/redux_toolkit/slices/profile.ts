import { createSlice } from '@reduxjs/toolkit';
import { ProfileInit } from '../../interface/interface_default'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: ProfileInit = {
    scrollMemory: 0
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setScrollMemoryProfile: (state, action: PayloadAction<number>) => {
            state.scrollMemory = action.payload
        }
    },
});

export const profileActions = profileSlice.actions;
export const profileReducer = profileSlice.reducer;