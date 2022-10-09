import React, { useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

import { PhotoCard } from '../PhotoCard/PhotoCard'
import { Loading } from '../Loading/Loading';

import { useAppSelector, useActions } from '../../hooks/useRedux'
import { useTranslation } from 'react-i18next';
import { AvatarModel } from '../../models/avatar'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import '../../sass/_dialogs_photo.scss'

const sizeLimitFile: number = 10048576
const possibleTypeFile: string[] = ["image/jpeg", "image/jpg", "image/png"]

export const PhotoDialogs: React.FC = () => {
    const [url, setUrl] = useState<AvatarModel[]>([
        {
            id: '1',
            type: 'present',
            url: 'https://images.unsplash.com/photo-1658094048401-7ce081dd3b5e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            active: false
        },
        {
            id: '2',
            type: 'present',
            url: 'https://images.unsplash.com/photo-1658094048401-7ce081dd3b5e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            active: true
        },
        {
            id: '3',
            type: 'present',
            url: 'https://images.unsplash.com/photo-1658094048401-7ce081dd3b5e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            active: false
        }
    ])
    const { dialogs } = useAppSelector(state => state.global)
    const { setProfilePhoto } = useActions()
    const { t } = useTranslation()
    const removeItem = (id: string) => setUrl(prevState => prevState.filter(u => u.id !== id))
    const changeFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (!e.target.files || !e.target.files.length) {
            return
        }
        const file = e.target.files[0]
        if (!possibleTypeFile.includes(file.type)) {
            toast(t("fileNotValid.type"), { autoClose: 2000 })
            return
        }
        if (file.size > sizeLimitFile) {
            toast(t("fileNotValid.big"), { autoClose: 2000 })
            return
        }
        if (url.length >= 5) {
            toast(t("fileNotValid.maxPhoto"), { autoClose: 2000 })
            return
        }
        const objectUrl = URL.createObjectURL(file)
        setUrl(preState => [
            {
                id: v4(),
                type: "new",
                url: objectUrl,
                active: false
            },
            ...preState
        ])
    }
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
            fullWidth={true} open={dialogs.profilePhoto}>
            <Loading customClass="dpp-content" active={false}>
                <DialogTitle className='custom-title' textAlign="center">{t("profile.addPhotoTitle")}</DialogTitle>
                <TransitionGroup className="center-photo-box">
                    {url.map((u) => (
                        <CSSTransition
                            key={u.id}
                            timeout={300}
                            classNames="avatar"
                        >
                            <PhotoCard
                                src={u.url}
                                active={u.active}
                                unUse={() => console.log('un_use')}
                                remove={() => removeItem(u.id)}
                                use={() => console.log('use')}
                            />
                        </CSSTransition>
                    ))}

                </TransitionGroup>
                <DialogActions className='btn-block'>
                    <Button onClick={() => setProfilePhoto(false)}>{t("profile.btn.close")}</Button>
                    <Button onClick={trigger}>{t("profile.btn.addPhoto")}</Button>
                </DialogActions>
                <input accept={".jpg, .jpeg, .png"} onChange={e => changeFile(e)} className='inp-file' type="file" />
            </Loading>
        </Dialog>
    );
}
