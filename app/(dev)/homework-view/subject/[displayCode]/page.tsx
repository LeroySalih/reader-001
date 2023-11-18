import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import DisplayAssigment from '../../display-assignment';

export default async function Page ({params}: {params: {displayCode: string[]}}) {

    const {displayCode} = params;

    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const {data: assignmentDataArr, error} = await supabase.from("msTeamsAssignments")
        .select("id, displayName, msTeamsClasses(displayName), dueDateTime, status")
        .order("dueDateTime", {ascending: false})
        // .eq("msTeamsClasses_displayName", displayCode)
    
    //@ts-ignore
    const assignmentData = assignmentDataArr?.filter(a => a.msTeamsClasses?.displayName == displayCode)
    error && console.error(error);

    return <>
        <h1>Subject Plan for {displayCode}</h1>
        {
            assignmentData?.map((a,i) => <DisplayAssigment key={i} title={a.displayName} dueDateTime={a.dueDateTime} status={a.status}/>)
        }
        
    </>
}