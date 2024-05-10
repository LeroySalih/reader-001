"use client"


import {createClient} from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";
import styles from "./display-log.module.css";

const DisplayLog = () => {
    const [entries, setEntries] = useState<any[] | null>([]);

    const supabase = createClient();

    const updateLog = (log:any) => {
        //console.log("Adding log entry", log);
        //@ts-ignore
        //const msgs = [log, ...entries];
        setEntries((entries:any) => [log, ...entries]);

    };

    const loadEntries = async () => {
        const {data, error} = await supabase.from("log")
                                .select("*")
                                .order("created_at", {ascending: false})
                                //.limit(10);
        error && console.error(error);
        setEntries(data);
    }

    useEffect(()=> {
        

        console.log("Subscribed")

        const logInsertFeed = supabase.channel('custom-insert-channel')
                            .on(
                                'postgres_changes',
                                { event: '*', schema: 'public', table: 'log' },
                                (payload) => {
                                    
                                    switch (payload.eventType) {
                                        case 'DELETE' : updateLog(payload.new); return;
                                        case 'INSERT' : updateLog(payload.new); return;
                                        default: console.error("Unknown event type", payload.eventType)
                                    }

                                    console.log('Event received!', payload.eventType, payload.new);
                                    
                                }
                            )
                            .subscribe()

        
        



        loadEntries();


        return ()=> {
            logInsertFeed.unsubscribe();
            
        }
    }, [])
    return <>
    <h1>Log Entries:</h1>
    {
        entries && entries.map((e, i) => <div key={e.id} className={styles.logEntry}>[{e.type}] {e.message}</div>)
    }
    
    </>
}

export default DisplayLog;