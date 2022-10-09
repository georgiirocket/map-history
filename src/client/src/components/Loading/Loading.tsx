import React from "react";
import { CSSTransition } from 'react-transition-group';
import '../../sass/_loading.scss'

interface Props {
    children: JSX.Element | JSX.Element[],
    active: boolean
    customClass?: string,
    customStyle?: any
}

export const Loading: React.FC<Props> = ({ children, active, customClass = '', customStyle = {} }) => {
    return (
        <div style={customStyle} className={`loading-container ${customClass}`}>
            {children}
            <CSSTransition in={active} timeout={300} unmountOnExit classNames="load-tr">
                <div className="wave-center">
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                </div>
            </CSSTransition>
        </div>
    )
}