import React from "react";
import InfoIcon from '@mui/icons-material/Info';
import '../../sass/_infobtn.scss'

interface InfoBtnProps {
    onClick: () => void
}

export const InfoBtn: React.FC<InfoBtnProps> = ({ onClick }) => {
    return (
        <div onClick={onClick} className="info-btn">
            <InfoIcon />
        </div>
    )
}