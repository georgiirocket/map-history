import React, { useState, ChangeEvent, useContext } from 'react'
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
import { RequestContext } from '../../providers/Request'
import '../../sass/_register.scss'

interface NotAccessValidDataType {
    login: boolean
    password: boolean
}
interface DataRegisterFormType {
    login: string
    password: string
}
const d_notAccsessValidData: NotAccessValidDataType = {
    login: false, password: false
}
const d_dataRegisterForm: DataRegisterFormType = {
    login: "", password: ""
}

export const SignIn: React.FC = () => {
    const { signIn } = useContext(RequestContext)
    const { t } = useTranslation()
    const size = useWindowSize()
    const [notAccsessServer, setNotAcsessServer] = useState(false)
    const [dataRegisterForm, setDataRegisterForm] = useState<DataRegisterFormType>(d_dataRegisterForm)
    const [notAccsessValidData, setNotAccsessValidData] = useState<NotAccessValidDataType>(d_notAccsessValidData)
    const [showPass, setShowPass] = useState<boolean>(false)
    const [blockdedForm, setBlockedForm] = useState<boolean>(false)

    const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setNotAcsessServer(false)
        let v = event.target.value
        setDataRegisterForm(prevState => ({ ...prevState, password: v }))
        if (v && v.length < 8) {
            setNotAccsessValidData(prevState => ({ ...prevState, password: true }))
        } else {
            setNotAccsessValidData(prevState => ({ ...prevState, password: false }))
        }
    }
    const handleChangeLogin = (event: ChangeEvent<HTMLInputElement>) => {
        setNotAcsessServer(false)
        let v = event.target.value
        setDataRegisterForm(prevState => ({ ...prevState, login: v }))
        if (v && v.length < 6) {
            setNotAccsessValidData(prevState => ({ ...prevState, login: true }))
        } else {
            setNotAccsessValidData(prevState => ({ ...prevState, login: false }))
        }
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
    const clear = () => {
        setDataRegisterForm(d_dataRegisterForm)
        setNotAccsessValidData(d_notAccsessValidData)
    }
    const submit = async () => {
        setBlockedForm(true)
        let data = await signIn({
            login: dataRegisterForm.login,
            password: dataRegisterForm.password
        })
        setBlockedForm(false)
        if (!data) {
            setNotAcsessServer(true)
        }
    }
    return (
        <div className='register-box'>
            <Card className='rc'>
                <CardContent>
                    <Typography gutterBottom
                        variant={size.width < 576 ? "h6" : "h5"}
                        component="div"
                        textAlign="center"
                    >
                        MAP-HISTORY
                    </Typography>
                    <TextField
                        sx={{ marginBottom: '1rem' }}
                        fullWidth={true}
                        size={size.width < 576 ? "small" : "medium"}
                        required
                        label={t("signInPage.login")}
                        placeholder={t("signInPage.login")}
                        value={dataRegisterForm.login}
                        onChange={handleChangeLogin}
                        error={dataRegisterForm.login && notAccsessValidData.login ? true : false}
                    />
                    <FormControl
                        size={size.width < 576 ? "small" : "medium"}
                        sx={{ marginBottom: '1rem' }}
                        fullWidth={true} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">{t("signInPage.password")}</InputLabel>
                        <OutlinedInput
                            placeholder={t("signInPage.password")}
                            type={showPass ? 'text' : 'password'}
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
                    {notAccsessServer && (
                        <Typography variant="body2" sx={{ padding: '5px 0', color: "#d32f2f" }}>
                            {"Not accsess, please try again"}
                        </Typography>
                    )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button disabled={blockdedForm} onClick={clear} color="error" size="small">{t("registerPage.btn.clearTextField")}</Button>
                    <Button disabled={submitBlocked()} onClick={submit} size="small">{t("registerPage.btn.send")}</Button>
                </CardActions>
            </Card>
        </div>
    )
}