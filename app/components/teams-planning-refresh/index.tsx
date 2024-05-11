"use server"



import RefreshPlanning from '../refresh-planning';


import { createClient } from '@/app/utils/supabase/server';
import { DateTime} from "luxon";
import styles from "./index.module.css"

import { refeshPlanning } from './refresh-planning';


const TeamsAssignmentsRefresh = async () => {

    const supabase = createClient();

    const {data, error} = await supabase.from("updateTracker")
                .select("created_at, event")
                .eq("table", "assignments")
                .order("created_at", {ascending: false})
                .limit(1)
                .maybeSingle();

    return  <div className={styles.Card}>
        <h3>Planning</h3>
        {data?.event}: {data?.created_at.substring(0, 10)} {data?.created_at.substring(11, 16)} 
        <RefreshPlanning/>

        <form action={refeshPlanning}>
          <button type="submit">Refresh</button>
        </form>
         
    </div>
}

export default TeamsAssignmentsRefresh;

