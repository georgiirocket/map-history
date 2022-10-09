import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { RootState } from "../redux_toolkit/index"
import { aboutActions } from '../redux_toolkit/slices/about'
import { supportActions } from '../redux_toolkit/slices/support'
import { globalActions } from '../redux_toolkit/slices/global'
import { profileActions } from '../redux_toolkit/slices/profile'
import { mapActions } from '../redux_toolkit/slices/map'

const actions = {
    ...aboutActions,
    ...supportActions,
    ...globalActions,
    ...profileActions,
    ...mapActions
}
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useActions = () => {
    const dispatch = useDispatch()
    return bindActionCreators(actions, dispatch)
}