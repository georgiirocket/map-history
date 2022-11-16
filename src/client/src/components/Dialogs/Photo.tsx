import React, { useState, useContext, useEffect } from 'react';
import { RequestContext } from '../../providers/Request';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { AxiosRequestConfig } from "axios"

import { PhotoCard } from '../PhotoCard/PhotoCard'
import { Loading } from '../Loading/Loading';
import { LinearWithValueLabel } from '../LinearProgressWithLabel/LinearProgressWithLabel';

import { config } from "../../config/default";
import { useAppSelector, useActions } from '../../hooks/useRedux'
import { useTranslation } from 'react-i18next';
import { AvatarModel } from '../../models/avatar'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import '../../sass/_dialogs_photo.scss'

const sizeLimitFile: number = config.sizeLimitAvatarFile
const possibleTypeFile: string[] = config.typeAvatarFile

export const PhotoDialogs: React.FC = () => {
    const { getImageUrl, uploadAvatar, changeActiveAvatar, removeAvatar } = useContext(RequestContext)
    const [loading, setLoading] = useState<boolean>(true)
    const [progressUplFile, setProgressUplFile] = useState<number>(0)
    const [url, setUrl] = useState<AvatarModel[]>([])
    const { dialogs, authData } = useAppSelector(state => state.global)
    const { setProfilePhoto, setUrlAvatar } = useActions()
    const { t } = useTranslation()
    const loadUploadFile = progressUplFile > 0 ? true : false

    const getData = async () => {
        const res = await getImageUrl()
        if (res.data && !res.error) {
            setUrl(res.data.url.map(i => {
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
        const configReq: AxiosRequestConfig = {
            onUploadProgress({ loaded, total }) {
                const percentCompleted = (loaded / total) * 100
                percentCompleted >= 100 ? setProgressUplFile(0) : setProgressUplFile(percentCompleted)
            }
        }
        const uploadRes = await uploadAvatar(file, configReq)
        if (uploadRes.data && !uploadRes.error) {
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
    const tougleUsePhoto = async (a: string) => {
        const res = await changeActiveAvatar(a)
        if (res.error) {
            toast(t("Error Request"), { autoClose: 2000 })
            return
        }
        if (!res.data) {
            return
        }
        setUrlAvatar(res.data.url_avatar)
        setUrl(prevState => {
            return !res.data?.url_avatar ? prevState.map(i => ({ ...i, active: false })) :
                prevState.map(i => i.url === res.data?.url_avatar ? ({ ...i, active: true }) : ({ ...i, active: false }))
        })
    }
    const remove = async (id: string) => {
        const res = await removeAvatar(id)
        if (res.error) {
            toast(t("Error Request"), { autoClose: 2000 })
            return
        }
        if (!res.data) {
            return
        }
        if (authData?.url_avatar === res.data.deleteId) {
            setUrlAvatar("")
        }
        setUrl(prevState => prevState.filter(i => i.url !== res.data.deleteId))
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
                <div style={{ opacity: progressUplFile ? 1 : 0 }} className='progress-avatar-container'>
                    <LinearWithValueLabel value={progressUplFile} />
                </div>
                <TransitionGroup className="center-photo-box">
                    {url.map((u) => (
                        <CSSTransition
                            key={u.id}
                            timeout={300}
                            classNames="avatar"
                        >
                            <PhotoCard
                                disabledMenu={loadUploadFile}
                                src={config.apiConfig.getImage + u.url}
                                active={u.active}
                                unUse={() => tougleUsePhoto("")}
                                remove={() => remove(u.url)}
                                use={() => tougleUsePhoto(u.url)}
                            />
                        </CSSTransition>
                    ))}
                </TransitionGroup>
                <DialogActions className='btn-block'>
                    <Button disabled={loadUploadFile} onClick={() => setProfilePhoto(false)}>{t("profile.btn.close")}</Button>
                    <Button disabled={loadUploadFile} onClick={trigger}>{t("profile.btn.addPhoto")}</Button>
                </DialogActions>
                <input accept={".jpg, .jpeg, .png"} onChange={e => changeFile(e)} className='inp-file' type="file" />
            </Loading>
        </Dialog>
    );
}
