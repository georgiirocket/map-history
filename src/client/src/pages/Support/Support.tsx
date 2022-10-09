import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { CSSTransition } from 'react-transition-group';

import { useTranslation } from 'react-i18next';
import { useAppSelector, useActions } from '../../hooks/useRedux'
import { useWindowSize } from '../../hooks/useWindowResize';
import '../../sass/_support.scss'


export const Support: React.FC = () => {
    const { t } = useTranslation()
    return (
        <div className='support-page'>
            <Card className="rc">
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {t("supportPage.name")}
                    </Typography>
                    <HorizontalNonLinearStepper />
                </CardContent>
            </Card>
        </div>
    )
}

function Content() {
    const { miniPage, topic } = useAppSelector((state) => state.support)
    const { width } = useWindowSize()
    const { setTopic } = useActions()
    const { t } = useTranslation()
    const handleChange = (event: SelectChangeEvent) => {
        setTopic(event.target.value)
    };

    if (miniPage === 1) {
        return (
            <div>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl size={width <= 576 ? "small" : "medium"}
                        required fullWidth sx={{ mb: 1.5 }}>
                        <InputLabel id="demo-simple-select-label">Тема</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={topic}
                            label={t("supportPage.topicPlaceholder")}
                            onChange={handleChange}
                        >
                            <MenuItem value={"block"}>{t("supportPage.topic.block")}</MenuItem>
                            <MenuItem value={"another"}>{t("supportPage.topic.another")}</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        size={width <= 576 ? "small" : "medium"}
                        required
                        placeholder={t("supportPage.emailPlaceholder")}
                        fullWidth label={t("supportPage.email")} variant="outlined" sx={{ mb: 1.5 }}
                    />
                    <CSSTransition in={topic !== "block" ? false : true} timeout={300} unmountOnExit classNames="l-block">
                        <div>
                            <TextField
                                fullWidth
                                size={width <= 576 ? "small" : "medium"}
                                label={t("supportPage.login")} variant="outlined" sx={{ mb: 1.5 }} />
                            <Typography variant="body2" color="text.secondary">
                                {t("supportPage.loginDescription")}
                            </Typography>
                        </div>
                    </CSSTransition>
                </Box>
            </div>
        )
    }
    if (miniPage === 2) {
        return (
            <div>
                <TextareaAutosize
                    className='cust-ta'
                    aria-label="minimum height"
                    placeholder={t("supportPage.appealPlaceholder")}
                />
            </div>
        )
    }
    return (
        <Typography textAlign="left" variant="body2" color="text.secondary">
            {t("supportPage.descriprion")}
        </Typography>
    )
}


function HorizontalNonLinearStepper() {
    const { miniPage: activeStep } = useAppSelector((state) => state.support)
    const { currentMiniPage, backMiniPage, nextMiniPage } = useActions()
    const { t } = useTranslation()
    const steps = [t("supportPage.steps.first"), t("supportPage.steps.second"), t("supportPage.steps.third")]

    const handleStep = (step: number) => () => currentMiniPage(step)

    //completed={completed[index]}
    return (
        <Box sx={{ width: '100%' }}>
            <Stepper className='custom-support-stepper' nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label} >
                        <StepButton color="inherit" onClick={handleStep(index)}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <div>
                <React.Fragment>
                    <div className='content-wrapper'>
                        <Content />
                    </div>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={backMiniPage}
                            sx={{ mr: 1 }}
                        >
                            {t("supportPage.btn.back")}
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={nextMiniPage} sx={{ mr: 1 }}>
                            {t("supportPage.btn.next")}
                        </Button>
                        <Button >
                            {t("supportPage.btn.send")}
                        </Button>
                    </Box>
                </React.Fragment>
            </div>
        </Box>
    );
}