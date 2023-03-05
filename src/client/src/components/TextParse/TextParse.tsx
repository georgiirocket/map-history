import React, { useId } from "react";

interface TextParseProps {
    text: string[]
}

export const TextParse: React.FC<TextParseProps> = ({ text }) => {
    const blockId = useId()
    return (<>{text.map((t, index) => <span key={`${blockId}${index}`}>{t}<br /></span>)}</>)
}