import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { callFullApi, dbLog } from "../../lib";
import {SupabaseClient} from "@supabase/supabase-js";
import {subDays, formatISO} from "date-fns"
import { refreshAssignment } from "../lib";

type assignments = {
    id: any;
    classId: any;
    displayName: any;
    webUrl: any;
    dueDateTime: any;
}[] | null

const getAssignments = async (supabase: SupabaseClient<any, "public", any>) => {

    const {data, error} = await supabase.from("msTeamsAssignments").select("id, classId").gte("dueDateTime", formatISO(subDays(new Date(), 14)));

    if (error) {
        console.error(error);
        return []
    }

    return data;

}

const sleep = async (duration: number) => {

    return new Promise((res, rej) => {
        setTimeout( ()=> {res(true)}, duration) ;
    })
        
}

export async function GET(request: Request) {

    console.log("/api/homework/refresh called");
    
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const session = await supabase.auth.getSession();
  
    const token = session?.data?.session?.provider_token;

    if (!token){
      dbLog(   "error", "No token found")
      return Response.json({status: false, message: "No token found"} )
    } ;

    const assignments = await getAssignments(supabase);
    
    const responses = [];

    for (const assignment of assignments) {

        const {data, error} = await refreshAssignment(supabase, token, assignment.classId, assignment.id)

        responses.push({classId: assignment.classId, assignmentId: assignment.id, data, error});

        await sleep(1000);

    }

    console.log("Done...")
    
    return Response.json({status: "ok", responses});
}