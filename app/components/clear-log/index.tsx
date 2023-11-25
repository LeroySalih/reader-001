"use client"

import { createClient } from '@supabase/supabase-js'


export default function ClearLog () {


    const dbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const dbAnnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // console.log("env vars", baseUrl, dbUrl, dbAnnonKey);

    // Create a single supabase client for interacting with your database
    const supabase = createClient(dbUrl!, dbAnnonKey!);

    const clearLog = async ({setEntries}:any) => {
        console.info("info", "Clearing Log")
        const {data, error} = await supabase.from("log").delete().neq("id", 0).select("id");
        error && console.error(error);
        console.log(`Cleared ${data?.length} entries` )

        await supabase.from("log").insert({type: "info", "message": "Log Cleared"});
        setEntries && setEntries([])
    }

    return <button onClick={clearLog}>Clear Log</button>
}