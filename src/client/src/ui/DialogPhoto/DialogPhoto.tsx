import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";

import { PhotoCard } from '../../components/PhotoCard/PhotoCard';
import { Loading } from '../../components/Loading/Loading';
import { LinearWithValueLabel } from '../../components/LinearProgressWithLabel/LinearProgressWithLabel';

import { PhotoUiDialogProps } from '../../interface/interface_default';
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import '../../sass/_dialogs_photo.scss'


export const PhotoUiDialog: React.FC<PhotoUiDialogProps> = ({
    fullWidth = true,
    open = true,
    activeLoading,
    progressUplFile = 0,
    title,
    closeBtnTitle = "close",
    addBtnTitle = "add",
    closeHandler,
    changeFile,
    cssTimeout = 300,
    data,
    multiple = false
}) => {
    const { t } = useTranslation()
    const loadUploadFile = progressUplFile > 0 ? true : false
    const trigger = () => {
        let input: HTMLElement = document.querySelector('.inp-file') as HTMLElement
        if (input) {
            input.click()
        }
    }

    return (
        <Dialog
            PaperProps={{
                sx: {
                    minHeight: "calc(100% - 10px)",
                    minWidth: "calc(100% - 10px)"
                }
            }}
            className="dialog-pp-container"
            fullWidth={fullWidth} open={open}>
            <Loading customClass="dpp-content" active={activeLoading}>
                <DialogTitle className='custom-title' textAlign="center">{title}</DialogTitle>
                <div style={{ opacity: progressUplFile ? 1 : 0 }} className='progress-avatar-container'>
                    <LinearWithValueLabel value={progressUplFile} />
                </div>
                <TransitionGroup className="center-photo-box">
                    {!data.length ? (
                        <CSSTransition
                            timeout={0}
                            classNames="avatar"
                        >
                            <div className='not-photo'>
                                <Typography textAlign="center" variant="subtitle2" gutterBottom>
                                    {t("photosCard.addPhotos")}
                                </Typography>
                            </div>
                        </CSSTransition>
                    ) : data.map(d => (
                        <CSSTransition
                            key={d.id}
                            timeout={cssTimeout}
                            classNames="avatar"
                        >
                            <PhotoCard
                                disabledMenu={loadUploadFile}
                                src={d.url}
                                active={d.active}
                                options={d.options}
                                specialFilter={d.specialFilter}
                            />
                        </CSSTransition>
                    ))}
                </TransitionGroup>
                <DialogActions className='btn-block'>
                    <Button disabled={loadUploadFile} onClick={closeHandler}>{closeBtnTitle}</Button>
                    <Button disabled={loadUploadFile} onClick={trigger}>{addBtnTitle}</Button>
                </DialogActions>
                <input multiple={multiple} accept={".jpg, .jpeg, .png"} onChange={changeFile} className='inp-file' type="file" />
            </Loading>
        </Dialog>
    );
}
