import { createSlice } from '@reduxjs/toolkit';
import { GlobalInit, LoadingApp } from '../../interface/interface_default'
import { check_language } from '../../handlers/checklanguage'
import { check_theme } from '../../handlers/checktheme'
import type { PayloadAction } from '@reduxjs/toolkit'
import { AuthData } from '../../models/authdata'

check_language()

const initialState: GlobalInit = {
    readyApp: true,
    load: {
        loading: false,
        loadChecknickname: false,
        loadCheckLogin: false,
        loadRegister: false,
        loadCheckToken: false,
        loadExit: false,
        loadSignIn: false
    },
    isAuth: false,
    authData: null,
    socket: null,
    navBar: false,
    language: localStorage.getItem('lang') || check_language() || 'en',
    theme: localStorage.getItem('theme') ?? check_theme(),
    isKeyboardMobile: false,
    dialogs: {
        language: false,
        profilePhoto: false
    }
};

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setReadyApp: (state, action: PayloadAction<boolean>) => {
            state.readyApp = action.payload
        },
        navBarTougle: (state) => {
            state.navBar = !state.navBar
        },
        themeTougle: (state) => {
            if (state.theme === 'light') {
                state.theme = 'dark'
                localStorage.setItem('theme', 'dark')
            } else {
                state.theme = 'light'
                localStorage.setItem('theme', 'light')
            }
        },
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload
        },
        openDialogLanguage: (state, action: PayloadAction<boolean>) => {
            state.dialogs.language = action.payload
        },
        openKeyboardMobile: (state, action: PayloadAction<boolean>) => {
            state.isKeyboardMobile = action.payload
        },
        setProfilePhoto: (state, action: PayloadAction<boolean>) => {
            state.dialogs.profilePhoto = action.payload
        },
        setLoadCheckNickname: (state, action: PayloadAction<boolean>) => {
            state.load.loadChecknickname = action.payload
        },
        setLoadCheckLogin: (state, action: PayloadAction<boolean>) => {
            state.load.loadCheckLogin = action.payload
        },
        setLoadRegister: (state, action: PayloadAction<boolean>) => {
            state.load.loadRegister = action.payload
        },
        setUserData: (state, action: PayloadAction<AuthData | null>) => {
            state.authData = action.payload
        },
        setIsAuth: (state, action: PayloadAction<boolean>) => {
            state.isAuth = action.payload
        },
        setLoadCheckToken: (state, action: PayloadAction<boolean>) => {
            state.load.loadCheckToken = action.payload
        },
        setLoadExit: (state, action: PayloadAction<boolean>) => {
            state.load.loadCheckToken = action.payload
        },
        setLoadSignIn: (state, action: PayloadAction<boolean>) => {
            state.load.loadSignIn = action.payload
        },
        setUrlAvatar: (state, action: PayloadAction<string>) => {
            if (state.authData) {
                state.authData.url_avatar = action.payload
            }
        },
    },
});


export const globalActions = globalSlice.actions;
export const globalReducer = globalSlice.reducer;
export const loadFlag = (data: LoadingApp): string => {
    return Object.values(data).find(i => i) ? "true" : "false"
}
