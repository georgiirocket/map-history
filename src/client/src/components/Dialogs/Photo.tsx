import React, { useState, useContext, useEffect } from 'react';
import { RequestContext } from '../../providers/Request';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

import { PhotoCard } from '../PhotoCard/PhotoCard'
import { Loading } from '../Loading/Loading';

import { config } from "../../config/default";
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
    const { getImageUrl, uploadAvatar } = useContext(RequestContext)
    const [loading, setLoading] = useState<boolean>(true)
    const [url, setUrl] = useState<AvatarModel[]>([])
    const { dialogs, authData } = useAppSelector(state => state.global)
    const { setProfilePhoto } = useActions()
    const { t } = useTranslation()
    const removeItem = (id: string) => setUrl(prevState => prevState.filter(u => u.id !== id))
    const getData = async () => {
        const res = await getImageUrl()
        if (res) {
            setUrl(res.url.map(i => {
                return ({
                    id: v4(),
                    url: i,
                    active: i === authData?.url_avatar ? true : false
                })
            }))
        }
        setLoading(false)
    }
    const changeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const uploadRes = await uploadAvatar(file)
        if (uploadRes.data) {
            setUrl(prevState => {
                const newPhoto: AvatarModel = {
                    id: v4(),
                    url: uploadRes.data,
                    active: false
                }
                return [newPhoto, ...prevState]
            })
        }
        if (uploadRes.error) {
            toast(t("errUploadAvatar"), { autoClose: 2000 })
            console.error(uploadRes.error)
        }
        setLoading(false)
    }
    const trigger = () => {
        let input: HTMLElement = document.querySelector('.inp-file') as HTMLElement
        if (input) {
            input.click()
        }
    }
    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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
            <Loading customClass="dpp-content" active={loading}>
                <DialogTitle className='custom-title' textAlign="center">{t("profile.addPhotoTitle")}</DialogTitle>
                <TransitionGroup className="center-photo-box">
                    {url.map((u) => (
                        <CSSTransition
                            key={u.id}
                            timeout={300}
                            classNames="avatar"
                        >
                            <PhotoCard
                                src={config.apiConfig.getImage + u.url}
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
