import React from "react";
import Alert from '@mui/material/Alert';
import { CSSTransition } from 'react-transition-group';
import { useAppSelector } from "../../hooks/useRedux";
import '../../sass/_alertmap.scss'

interface AlertMapProps {
    onClose: () => void
}

export const AlertMap: React.FC<AlertMapProps> = ({ onClose }) => {
    const { alertMap } = useAppSelector(state => state.map)
    return (
        <CSSTransition in={!alertMap ? false : true} timeout={300} unmountOnExit classNames="alertm">
            <div className="alert-map">
                <Alert onClose={onClose} severity="info">{alertMap}</Alert>
            </div>
        </CSSTransition>
    )
}