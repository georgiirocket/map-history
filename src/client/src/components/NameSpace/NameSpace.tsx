import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import { themeApp } from '../../styles/_default';
import '../../sass/_namespace.scss'

type Props = {
    text: string
}

export const NameSpace: React.FC<Props> = ({ text }) => {
    const [localText, setLocalText] = useState<string>('')
    const animate = () => {
        let text = document.querySelector('.t-cust-text')
        if (text) {
            text.classList.toggle('animate-tct')
            setTimeout(() => {
                if (text) {
                    text.classList.toggle('animate-tct')
                }
            }, themeApp.DELAY_ANIMATE_NAMESPACE)
        }
    }
    useEffect(() => {
        if (localText !== text) {
            animate()
        }
        setLocalText(text)
    }, [text, localText])
    return (
        <Typography data-text={localText} className='t-cust' variant="h6" color="inherit" noWrap component="div">
            <p className='t-cust-text'>{text}</p>
        </Typography>
    )
}