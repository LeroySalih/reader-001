"use client"

import { createClient } from '@/app/utils/supabase/client';
import { useEffect, useState } from "react";
import { Session, User } from '@supabase/supabase-js';
import Button from '@mui/material/Button';

import { refreshPlanning, clearAssignments, getClassIds, getUserToken, getAssignmentsForClassIdFromTeams, upsertAssignment } from './planning-server-lib';

export default function RefreshAssignments () {

    const [user, setUser] = useState<User | null>(null);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // console.log("env vars", baseUrl, dbUrl, dbAnnonKey);

    // Create a single supabase client for interacting with your database
    const supabase = createClient(); 

    const refresh = async () => {
        console.log("refresh called")
        
        // call to server side function to perform refresh
        await refreshPlanning();
    
    }


    useEffect(()=>{

        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
          });

        const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
        })

        return () => {}
    },[])
    return <>
        <Button onClick={refresh}>Refresh Assignments</Button>
    </>
}