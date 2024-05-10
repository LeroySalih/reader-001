"use server"

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import RefreshAssignments from '../refresh-assignments';
import RefreshMarking from "../refresh-marking";

import { createClient } from '@/app/utils/supabase/server';
import { DateTime} from "luxon";
import styles from "./index.module.css"
const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

const TeamsAssignmentsRefresh = async () => {

    const supabase = createClient();

    const {data, error} = await supabase.from("updateTracker")
                .select("created_at, event")
                .eq("table", "assignments")
                .order("created_at", {ascending: false})
                .limit(1)
                .maybeSingle();

    return <>
         <Card sx={{ minWidth: 275 }} className={styles.card}>
            <CardContent>
                <Typography variant="h5" component="div">
                Assignments
                </Typography>
                <Typography sx={{ fontSize: 12 }} color="text.secondary">
                {data?.event}: {data?.created_at.substring(0, 10)} {data?.created_at.substring(11, 16)} 
                </Typography>        
            </CardContent>
            <CardActions>
                <RefreshAssignments/>
               
            </CardActions>
        </Card>
    </>
}

export default TeamsAssignmentsRefresh;

