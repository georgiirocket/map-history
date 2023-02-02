import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useTranslation } from "react-i18next";
import "../../sass/_textdialog.scss"

interface TextDialogProps {
    title: string,
    startValue: string,
    placeholder?: string,
    close: () => void,
    handler: (p: string) => void
}

export const TextDialog: React.FC<TextDialogProps> = ({
    title, placeholder = "Text...",
    startValue,
    close,
    handler
}) => {
    const [text, setText] = React.useState<string>(startValue)
    const { t } = useTranslation()
    return (
        <Dialog onClose={close} fullWidth={true} maxWidth="sm" open={true}>
            <DialogTitle textAlign="center">{title}</DialogTitle>
            <Card className="card-style" sx={{ maxWidth: "100%" }}>
                <CardContent>
                    <TextareaAutosize
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className='cust-ta'
                        aria-label="minimum height"
                        placeholder={placeholder}
                    />
                </CardContent>
                <CardActions style={{ display: "flex", justifyContent: "center" }}>
                    <Button onClick={() => handler(text)} size="small">{t("textDialog.positive")}</Button>
                    <Button onClick={close} size="small">{t("textDialog.negative")}</Button>
                </CardActions>
            </Card>
        </Dialog>
    );
}