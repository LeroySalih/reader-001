import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import axios from 'axios';
import { dbLog } from "../../lib";

async function callApi (uri: string, token: string) {

    const options = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    console.log(`request made to ${uri} at:  ${new Date().toString()}`);

    try {
      const response = await axios.get(uri, options);
      return response.data;
    } catch (error) {
        console.error(error)
        return error;
    }

}; 

async function callFullApi(uri : string, token : string) {

  console.log("Calling MS Graph API", uri, token);

  let values:any = [];

  let response = await callApi(uri, token);

  values = values.concat(response.value);

  while (response['@odata.nextLink']) {
    console.log("nextLink detected", response['@odata.nextLink'])
    response = await callApi(response['@odata.nextLink'], token);
    values = values.concat(response.value);
  }
  // console.log(response.value);
  
  //values = values.concat(response.value);

  return values;
}





export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
    

    const messages:any[] = [];

    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore })


    console.log('API refresh called');
    dbLog(   "info", "Refresh API called")

    const session = await supabase.auth.getSession();
  
    const token = session?.data?.session?.provider_token;

    if (!token){
      dbLog(   "error", "No token found")
      return Response.json({status: false, message: "No token found"} )
    } ;

    

    const {data, error} = await supabase.from("msTeamsClasses")
                        .select("id, displayName")
                        .in("displayName", ['23-11CS', '23-10CS', 
                        '23-13BS', '23-12BS', '23-11BS1', '23-11BS2', '23-11BS1', '23-10BS1', '23-10BS2',
                        '23-11EC1', '23-11EC', '23-10EC', '23-10EC1',
                        '23-11IT', '23-10IT']);


    const myUpsertData: any = [];
        //@ts-ignore
        const asyncRes = await Promise.all(data?.map(async (d) => {

            const url = `https://graph.microsoft.com/v1.0/education/classes/${d.id}/assignments`
            
//            console.log(url);
        
            const myAssignments = await callFullApi(url, token!);
            dbLog("info", `Received: ${myAssignments.length} assignments`)
            console.log("info", `Received: ${myAssignments.length} assignments`)
//            console.log(myAssignments);
        
            const upsertData = myAssignments.map((a:any) => ({
                id: a.id,
                classId: a.classId,
                displayName: a.displayName,
                dueDateTime: a.dueDateTime,   
                instructions: a.instructions?.content,
                status: a.status,
                webUrl: a.webUrl 
            }))

            myUpsertData.push(upsertData);
        
            
            for (const ud of upsertData){
                
                const {error} = await supabase.from("msTeamsAssignments").upsert(ud, {onConflict:"id"})
                //!error && dbLog("info", "Row Added");
                error && dbLog("error", error.message);
                error && messages.push(error.message); 
            }
            
        
            dbLog("info", `Refresh completed for ${d.displayName}`)
      
            })
            )

    dbLog("info", `Refresh completed for all classes`)
    return Response.json( {status: true, message: "OK", token, messages})
}