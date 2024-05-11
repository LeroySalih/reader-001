"use client"


import {createClient} from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";
import styles from "./display-log.module.css";
import { clearServerLog, loadServerLog } from "./log-server-lib";

const DisplayLog = () => {
    const [entries, setEntries] = useState<any[] | null>([]);

    const supabase = createClient();

    const updateLog = (log:any) => {
        //console.log("Adding log entry", log);
        //@ts-ignore
        //const msgs = [log, ...entries];
        console.log("new update from db")
        setEntries((entries:any) => [log, ...entries]);

    };

    const clearLog = () => {
        // reset the log entries
        setEntries([])
    }

    const loadEntries = async () => {

        const {data, error} = await loadServerLog(); 
                                
        error && console.error(error);
        
        setEntries(data);
    }

    const handleClearLog = async () => {
        const {data, error} = await clearServerLog();
        clearLog();
        console.log(data, error);
    }

    useEffect(()=> {
        

        console.log("Subscribed")

        const logInsertFeed = supabase.channel('custom-insert-channel')
                            .on(
                                'postgres_changes',
                                { event: 'INSERT', schema: 'public', table: 'log' },
                                (payload) => {
                                    
                                    switch (payload.eventType) {
                                        //case 'DELETE' : return;
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
    <h1>Log Entries: <button onClick={handleClearLog}>Clear</button></h1>
    {
        entries && entries.map((e, i) => <div key={e.id} className={styles.logEntry}>[{e.type}] {e.message}</div>)
    }
    
    </>
}

export default DisplayLog;