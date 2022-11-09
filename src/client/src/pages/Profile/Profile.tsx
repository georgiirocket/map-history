import React, { useState, useEffect, useContext, ChangeEvent } from 'react'
import { RequestContext } from '../../providers/Request';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import logo from '../../images/logo/logo.svg'
import { SkeletorHidden } from '../../components/SceletorHidden/SkeletorHidden'
import { useTranslation } from 'react-i18next';
import { useAppSelector, useActions } from '../../hooks/useRedux'
import { useWindowSize } from '../../hooks/useWindowResize';
import { useSaveScroll } from '../../hooks/useSaveScroll';
import { config } from '../../config/default';
import '../../sass/_profile.scss'

export const Profile: React.FC = () => {
    const { authData, language, theme, load: { loadingProfile } } = useAppSelector(state => state.global)
    const { updateProfile, getProfileInfo } = useContext(RequestContext)
    const [nickname, setNickname] = useState<string>("")
    const [login, setLogin] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const { scrollMemory } = useAppSelector(state => state.profile)
    const { setLanguage, setProfilePhoto, setScrollMemoryProfile } = useActions()
    const [showPass, setShowPass] = useState<boolean>(false)
    const [autoTheme, setAutoTheme] = useState<boolean>(localStorage.getItem('theme') ? false : true)
    const [autoLanguage, setAutoLanguage] = useState<boolean>(localStorage.getItem('lang') ? false : true)
    const { t } = useTranslation()
    const { width } = useWindowSize()
    const { ref: refScroll } = useSaveScroll({
        startScrollValue: scrollMemory,
        timeOut: 500,
        handler: setScrollMemoryProfile,
        containerName: 'content'
    })
    const handleChange = (event: SelectChangeEvent) => {
        setLanguage(event.target.value)
    };
    const openProfilePhoto = () => setProfilePhoto(true)
    const changeAutoTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setAutoTheme(e.target.checked)
            localStorage.removeItem('theme')
        } else {
            setAutoTheme(e.target.checked)
        }
    }
    const changeAutoLanguage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setAutoLanguage(e.target.checked)
            localStorage.removeItem('lang')
        } else {
            setAutoLanguage(e.target.checked)
        }
    }
    const changeLogin = (e: ChangeEvent<HTMLInputElement>) => {
        setLogin(e.target.value)
    }
    const changeNickname = (e: ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value)
    }
    const changePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }
    const getData = async () => {
        let res = await getProfileInfo()
        if (res.data) {
            setLogin(res.data.login)
            setNickname(res.data.nickname)
        }
    }
    const submit = async () => {
        console.log("N", nickname)
        console.log("L", login)
        console.log("P", password)
        let res = await updateProfile({ nickname, login, password })
        if (!res.data) {
            return
        }
        if (res.data.nickname) {
            setNickname(res.data.nickname)
        }
        if (res.data.login) {
            setLogin(res.data.login)
        }
    }
    useEffect(() => {
        let localLanguage = localStorage.getItem('lang')
        localLanguage ? setAutoLanguage(false) : setAutoLanguage(true)
    }, [language])
    useEffect(() => {
        let themeLocal = localStorage.getItem('theme')
        themeLocal ? setAutoTheme(false) : setAutoTheme(true)
    }, [theme])
    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className='profile-container'>
            <Card className="rc">
                <div ref={refScroll} className='content'>
                    <SkeletorHidden
                        customClass="img-cust"
                        pathImage={[logo]}
                    >
                        <CardMedia
                            component="img"
                            className="img-cust"
                            alt="green iguana"
                        />
                    </SkeletorHidden>
                    <div className='avatar-wrapper'>
                        <div className='avatar-box'>
                            {authData?.url_avatar ?
                                <Avatar onClick={openProfilePhoto} className='avatar-cust' alt={authData.nickname} src={config.apiConfig.getImage + authData.url_avatar} /> :
                                <Avatar onClick={openProfilePhoto} className='avatar-cust' sx={{ bgcolor: deepOrange[500] }}>{authData?.nickname.split('')[0] ?? 'A'}</Avatar>
                            }
                            <AddPhotoAlternateIcon onClick={openProfilePhoto} className='ed-photo' />
                        </div>
                    </div>
                    <Typography textAlign="center"
                        gutterBottom variant={width <= 576 ? "h6" : "h5"}
                        component="div">
                        {authData?.nickname || "Nickname"}
                    </Typography>
                    <div className='bottom-wrapper'>
                        <Typography
                            textAlign={width < 576 ? "left" : "center"}
                            variant="body2" gutterBottom>
                            {t("profile.infoPhoto")}
                        </Typography>
                        <Divider className='div-cust' />
                        <TextField
                            value={login}
                            onChange={changeLogin}
                            disabled={loadingProfile}
                            fullWidth
                            size={width < 576 ? "small" : "medium"}
                            label={t("registerPage.login")}
                            placeholder={t("registerPage.login")}
                        />
                        <Typography
                            textAlign={width < 576 ? "left" : "center"}
                            variant="body2" gutterBottom sx={{ m: ".5rem 0" }}>
                            {t("profile.infoLogin")}
                        </Typography>
                        <Divider className='div-cust' />
                        <FormControl
                            size={width < 576 ? "small" : "medium"}
                            fullWidth={true} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">{t("registerPage.password")}</InputLabel>
                            <OutlinedInput
                                disabled={loadingProfile}
                                placeholder={t("registerPage.password")}
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={changePassword}
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
                        <Typography
                            textAlign={width < 576 ? "left" : "center"}
                            variant="body2" gutterBottom sx={{ m: ".5rem 0" }}>
                            {t("profile.infoPass")}
                        </Typography>
                        <Divider className='div-cust' />
                        <TextField
                            value={nickname}
                            onChange={changeNickname}
                            disabled={loadingProfile}
                            fullWidth
                            size={width < 576 ? "small" : "medium"}
                            label={t("registerPage.nickName")}
                            placeholder={t("registerPage.nickName")}
                        />
                        <Typography
                            textAlign={width < 576 ? "left" : "center"}
                            variant="body2" gutterBottom sx={{ m: ".5rem 0" }}>
                            {t("profile.infoNickname")}
                        </Typography>
                        <Divider className='div-cust' />
                        <FormControl size={width <= 576 ? "small" : "medium"} fullWidth>
                            <InputLabel id="demo-simple-select-language">{t("profile.languagePlaceholder")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-language"
                                id="demo-simple-select"
                                value={language}
                                label={t("profile.languagePlaceholder")}
                                onChange={handleChange}
                            >
                                <MenuItem value={"en"}>{t("profile.language.en")}</MenuItem>
                                <MenuItem value={"uk"}>{t("profile.language.uk")}</MenuItem>
                                <MenuItem value={"rus"}>{t("profile.language.rus")}</MenuItem>
                            </Select>
                        </FormControl>
                        <Divider className='div-cust' />
                        <FormControlLabel label={t("profile.checkBoxLabel.autoTheme")}
                            control={<Checkbox onChange={changeAutoTheme} checked={autoTheme} />}
                        />
                        <Typography
                            textAlign={width < 576 ? "left" : "center"}
                            variant="body2" gutterBottom sx={{ m: ".5rem 0" }}>
                            {t("profile.autoThemeDescription")}
                        </Typography>
                        <Divider className='div-cust' />
                        <FormControlLabel label={t("profile.checkBoxLabel.autoLanguage")}
                            control={<Checkbox onChange={changeAutoLanguage} checked={autoLanguage} />}
                        />
                        <Typography
                            textAlign={width < 576 ? "left" : "center"}
                            variant="body2" gutterBottom sx={{ m: ".5rem 0" }}>
                            {t("profile.autoLanguageDescription")}
                        </Typography>
                        <Button
                            disabled={loadingProfile}
                            onClick={submit}
                            sx={{ width: "100%", bgcolor: deepOrange[400] }} variant="contained">
                            {t("profile.upadateDataProfile")}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}