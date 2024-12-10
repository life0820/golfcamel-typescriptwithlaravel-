import React from 'react';
import {Skeleton as MSkeleton} from '@mui/material';
import Grid from '@mui/material/Grid2';

export const Skeleton = (props: any) => {
    return (
        <div>
            <Grid container spacing={2} alignItems="center" >
                <Grid size={4}>
                    <MSkeleton variant="circular" width={50} height={50} />
                </Grid>
                <Grid size={8}>
                    <MSkeleton variant="text" />
                    <MSkeleton variant="text" />
                    <MSkeleton variant="text" />
                </Grid>
            </Grid>
        </div>
    )
}
