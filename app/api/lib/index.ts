
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import axios from 'axios';

export async function dbLog(type: string, message: string) {
    const cookieStore = cookies();
    const supabase = createClient();
  
    await supabase.from("log").insert({type, message}); 
  }

export async function callApi (uri: string, token: string) {

    const options = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    // console.log(`request made to ${uri} at:  ${new Date().toString()}`);

    try {
      const response = await axios.get(uri, options);
      return response.data;
    } catch (error:any) {
        console.error(error)
        throw new Error(error.message);
    }

}; 

export async function callFullApi(uri : string, token : string) {

  // console.log("Calling MS Graph API", uri, token);

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

export async function refreshClasses () {

  console.log('refreshClasses called')
  
  const supabase = createClient(); 

  const { data } = await supabase.from("test").select();
  const user = await supabase.auth.getUser()
  const session = await supabase.auth.getSession();
  
  const token = session?.data?.session?.provider_token;

  // return <pre>Supabase working! {JSON.stringify(user, null, 2)}</pre>
  const me = await callApi("https://graph.microsoft.com/v1.0/me", token!);
  const myClasses = await callFullApi("https://graph.microsoft.com/beta/education/me/classes", token!);
  
  const upsertData = myClasses.map((c:any) => ({id: c.id, displayName: c.displayName}));
  console.log("UpsertData", upsertData);
  
  for (const d of upsertData){
    const {error} = await supabase.from("msTeamsClasses").upsert(d)
    error && console.error(error)
  }
  
  
}
