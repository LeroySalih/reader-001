"use client"

import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from "react";
import { Session, User } from '@supabase/supabase-js';

export default function RefreshAssignments () {


    const [user, setUser] = useState<User | null>(null);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // console.log("env vars", baseUrl, dbUrl, dbAnnonKey);

    // Create a single supabase client for interacting with your database
    const supabase = createClientComponentClient({supabaseUrl, supabaseKey}) 

    const refresh = async () => {
        // console.log("Refresh called");

        // hack - delete not working server side so using client side code to delete
        // assignments. :(
        const {data: dataDelete, error} = await supabase.from("msTeamsAssignments")
                                .delete()
                                .neq("id", "02d75d23-03a4-4d14-9083-8285de4b0e11")
                                .select("displayName")
                                
                                
        
        error && console.error(error);
        console.log(`Found and deleted ${dataDelete?.length} items 2`);
        await supabase.from("log").insert({type:"info", message: `Deleted ${dataDelete?.length} assignments`});

        console.log(`${baseUrl}api/assignments/refresh`)
        const response = await fetch(`${baseUrl}api/assignments/refresh`);
        const data = await response.json()
        console.log(data);
    }


    useEffect(()=>{

        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
          });

        const authListener = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
        })


        return () => {
            
        }
    },[])
    return <button disabled={!user} onClick={refresh}>Refresh Assignments</button>
}