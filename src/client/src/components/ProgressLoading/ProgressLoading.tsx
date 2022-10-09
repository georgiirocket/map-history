import React from 'react';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import '../../sass/_progressLoading.scss'

export const ProgressLoading: React.FC = () => {
    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <LinearProgress className='pr-loading' />
        </Stack>
    );
}