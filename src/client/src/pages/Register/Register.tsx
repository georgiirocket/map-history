import React, { ChangeEvent, useState, useEffect } from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useTranslation } from 'react-i18next';
import { useWindowSize } from '../../hooks/useWindowResize'
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce'
import {
    useLazyCheckLoginQuery,
    useLazyCheckNicknameQuery,
    useRegisterMutation
} from '../../redux_toolkit/api/api';
import { config } from '../../config/default';
import '../../sass/_register.scss'

interface NotAccessValidDataType {
    login: boolean
    password: boolean
    nickname: boolean
}
interface DataRegisterFormType {
    login: string
    password: string
    nickname: string
}
const d_notAccsessValidData: NotAccessValidDataType = {
    login: false, password: false, nickname: false
}
const d_dataRegisterForm: DataRegisterFormType = {
    login: "", password: "", nickname: ""
}

interface R_props {
    owner?: boolean
}

export const Register: React.FC<R_props> = ({ owner = false }) => {
    let navigate = useNavigate()
    const { t } = useTranslation()
    const size = useWindowSize()
    const [showPass, setShowPass] = useState<boolean>(false)
    const [dataRegisterForm, setDataRegisterForm] = useState<DataRegisterFormType>(d_dataRegisterForm)
    const [notAccsessValidData, setNotAccsessValidData] = useState<NotAccessValidDataType>(d_notAccsessValidData)
    const [blockdedForm, setBlockedForm] = useState<boolean>(false)
    const nickname = useDebounce<string>(dataRegisterForm.nickname, 1000)
    const login = useDebounce<string>(dataRegisterForm.login, 1000)
    const [getCheckNickname] = useLazyCheckNicknameQuery()
    const [getCheckLogin] = useLazyCheckLoginQuery()
    const [getRegister] = useRegisterMutation()

    const handleChangeNickname = (event: ChangeEvent<HTMLInputElement>) => {
        setDataRegisterForm(prevState => ({ ...prevState, nickname: event.target.value }))
        setNotAccsessValidData(prevState => ({ ...prevState, nickname: false }))
    }
    const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        let v = event.target.value
        setDataRegisterForm(prevState => ({ ...prevState, password: v }))
        if (v && v.length < 8) {
            setNotAccsessValidData(prevState => ({ ...prevState, password: true }))
        } else {
            setNotAccsessValidData(prevState => ({ ...prevState, password: false }))
        }
    }
    const handleChangeLogin = (event: ChangeEvent<HTMLInputElement>) => {
        let v = event.target.value
        setDataRegisterForm(prevState => ({ ...prevState, login: v }))
        if (v && v.length < 6) {
            setNotAccsessValidData(prevState => ({ ...prevState, login: true }))
        } else {
            setNotAccsessValidData(prevState => ({ ...prevState, login: false }))
        }
    }
    const chechNikn = async (p: string) => {
        let data = await getCheckNickname(p)
        if ((data.data && data.data.data.created) || p.length < 6 || p.length > 20) {
            setNotAccsessValidData(prevState => ({ ...prevState, nickname: true }))
        }
    }
    const chechLogin = async (p: string) => {
        let data = await getCheckLogin(p)
        if ((data.data && data.data.data.created) || p.length < 6 || p.length > 20) {
            setNotAccsessValidData(prevState => ({ ...prevState, login: true }))
        }
    }
    const clear = () => {
        setDataRegisterForm(d_dataRegisterForm)
        setNotAccsessValidData(d_notAccsessValidData)
    }
    const submitBlocked = (): boolean => {
        if (blockdedForm) {
            return true
        }
        if (Object.values(dataRegisterForm).filter(i => !i).length) {
            return true
        }
        if (Object.values(notAccsessValidData).filter(i => i).length) {
            return true
        }
        return false
    }
    const submit = async () => {
        try {
            setBlockedForm(true)
            const res = await getRegister({
                login: dataRegisterForm.login,
                password: dataRegisterForm.password,
                nickName: dataRegisterForm.nickname,
                owner: owner
            }).unwrap()
            setBlockedForm(false)
            if (!res.error) {
                navigate(config.routes.map)
            }
        } catch {
            setBlockedForm(false)
        }
    }
    useEffect(() => {
        if (login) {
            chechLogin(login)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [login])
    useEffect(() => {
        if (nickname) {
            chechNikn(nickname)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nickname])
    return (
        <div className='register-box'>
            <Card className='rc'>
                <CardContent>
                    <Typography gutterBottom
                        variant={size.width < 576 ? "h6" : "h5"}
                        component="div"
                    >
                        {`${t("registerPage.name")} ${owner ? "[Owner]" : ""}`}
                    </Typography>
                    <TextField
                        fullWidth={true}
                        disabled={blockdedForm}
                        size={size.width < 576 ? "small" : "medium"}
                        required
                        label={t("registerPage.login")}
                        placeholder={t("registerPage.login")}
                        error={dataRegisterForm.login && notAccsessValidData.login ? true : false}
                        value={dataRegisterForm.login}
                        onChange={handleChangeLogin}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ padding: '5px 0' }}>
                        {t("registerPage.description.login")}
                    </Typography>
                    <FormControl
                        size={size.width < 576 ? "small" : "medium"}
                        fullWidth={true} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">{t("registerPage.password")}</InputLabel>
                        <OutlinedInput
                            placeholder={t("registerPage.password")}
                            type={showPass ? 'text' : 'password'}
                            disabled={blockdedForm}
                            value={dataRegisterForm.password}
                            onChange={handleChangePassword}
                            error={dataRegisterForm.password && notAccsessValidData.password ? true : false}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPass(prevState => !prevState)}
                                        // onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPass ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    <Typography variant="body2" color="text.secondary" sx={{ padding: '5px 0' }}>
                        {t("registerPage.description.password")}
                    </Typography>
                    <TextField
                        fullWidth={true}
                        size={size.width < 576 ? "small" : "medium"}
                        disabled={blockdedForm}
                        required
                        label={t("registerPage.nickName")}
                        placeholder={t("registerPage.nickName")}
                        error={dataRegisterForm.nickname && notAccsessValidData.nickname ? true : false}
                        value={dataRegisterForm.nickname}
                        onChange={handleChangeNickname}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ padding: '5px 0' }}>
                        {t("registerPage.description.nickName")}
                    </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button onClick={clear} disabled={blockdedForm} color="error" size="small">{t("registerPage.btn.clearTextField")}</Button>
                    <Button onClick={submit} disabled={submitBlocked()} size="small">{t("registerPage.btn.send")}</Button>
                </CardActions>
            </Card>
        </div>
    )
}