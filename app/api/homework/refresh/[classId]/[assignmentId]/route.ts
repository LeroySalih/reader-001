import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { callFullApi, dbLog } from "../../../../lib";
import { SupabaseClient} from "@supabase/supabase-js";
import {refreshAssignment} from "../../../lib";

export const dynamic = 'force-dynamic';


type Params = {
  classId: string,
  assignmentId: string
}

export async function GET(request: Request, context: {params: Params}) {
    
    console.log(context);

    const {params} = context;
    const {classId, assignmentId} = params;

    const messages:any[] = [];

    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore })


    console.log('homework refresh homework called for ', classId, assignmentId);
    console.log()
    
    dbLog(   "info", "Refresh API called")

    const session = await supabase.auth.getSession();
  
    const token = session?.data?.session?.provider_token;

    if (!token){
      dbLog(   "error", "No token found")
      return Response.json({status: false, message: "No token found"} )
    } ;

    const {data, error} = await refreshAssignment(supabase, token, classId, assignmentId)

    console.log("Done...")

    return Response.json({status: error == null ? "ok" : "error", data, error});

}