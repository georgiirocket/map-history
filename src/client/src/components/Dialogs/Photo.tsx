import React, { useState, useContext, useEffect } from 'react';
import { RequestContext } from '../../providers/Request';
import { AxiosRequestConfig } from "axios"

import { PhotoUiDialog } from '../../ui/DialogPhoto/DialogPhoto';

import { TypeOptions, PhotoUiDialogData } from '../../interface/interface_default';
import { config } from "../../config/default";
import { useAppSelector, useActions } from '../../hooks/useRedux'
import { useTranslation } from 'react-i18next';
import { AvatarModel } from '../../models/avatar'
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
    const dataForDialog = (p: AvatarModel[]): PhotoUiDialogData[] => p.map(u => {
        const options: TypeOptions[] = [
            [t("photoCard.btn.use"), 'u', () => tougleUsePhoto(u.url)],
            [t("photoCard.btn.unUse"), 'un', () => tougleUsePhoto("")],
            [t("photoCard.btn.remove"), 'r', () => remove(u.url)]
        ]
        const sf = (p: TypeOptions[]): TypeOptions[] => {
            return u.active ? p.filter(o => o[1] !== 'u') : p.filter(o => o[1] !== 'un')
        }
        return ({ ...u, options, specialFilter: sf, url: config.apiConfig.getImage + u.url })
    }, [])

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <PhotoUiDialog
            open={dialogs.profilePhoto}
            activeLoading={loading}
            progressUplFile={progressUplFile}
            title={t("profile.addPhotoTitle")}
            closeBtnTitle={t("profile.btn.close")}
            addBtnTitle={t("profile.btn.addPhoto")}
            closeHandler={() => setProfilePhoto(false)}
            data={dataForDialog(url)}
            changeFile={changeFile}
        />
    );
}
