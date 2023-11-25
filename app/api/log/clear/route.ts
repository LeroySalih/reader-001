import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import {dbLog} from "../../lib";

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {

    dbLog("info", "Clearing Log")

    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const {data: logData, error} = await supabase.from("log").delete().neq("id", 0).select("id");

    dbLog("info", `Cleared ${logData?.length} entries`)
    error && dbLog("error", error.message);
    
    return Response.json({status: 200, message: "OK"})

}