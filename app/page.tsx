import Image from 'next/image'
import styles from './page.module.css'

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import SignInButton from './login';
import axios from 'axios';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import previousSunday from 'date-fns/previousSunday'
import nextSaturday from 'date-fns/nextSaturday'
import isThisWeek from 'date-fns/isThisWeek'
import getWeek from 'date-fns/getWeek'
import parseISO from 'date-fns/parseISO'

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

  let values:any = [];

  let response = await callApi(uri, token);

  values = values.concat(response.value);

  while (response['@odata.nextLink']) {
    console.log("nextLink detected", response['@odata.nextLink'])
    response = await callApi(response['@odata.nextLink'], token);
    values = values.concat(response.value);
  }
  console.log(response.value);

  values = values.concat(response.value);

  return values;
}

export default async function Home() {

  //const supabaseUrl = process.env.SUPABASE_URL;
  //const supabaseKey = process.env.SUPABASE_ANON_KEY;
  //const supabase = createClient(supabaseUrl!, supabaseKey!)

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data } = await supabase.from("test").select();
  const user = await supabase.auth.getUser()
  const session = await supabase.auth.getSession();
  
  const token = session?.data?.session?.provider_token;

  // return <pre>Supabase working! {JSON.stringify(user, null, 2)}</pre>
  // const me = await callApi("https://graph.microsoft.com/v1.0/me", token!);
  // const myClasses = await callFullApi("https://graph.microsoft.com/beta/education/me/classes", token!);
  // const myAssignments = await callFullApi("https://graph.microsoft.com/v1.0/education/me/assignments", token!);

  async function refreshClasses () {

    'use server'
    console.log('refreshClasses called')
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

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

  async function dbLog (type: string, message: string) {

    'use server'
    console.log('refreshAssignments called')
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const {error} = await supabase.from("log").insert({type, message})

    error && console.error(error);

  }

  async function refreshAssignments () {
    'use server'
    
    console.log('refreshAssignments called')
   // dbLog('info', 'refreshAssignments called');

    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    await supabase.from("log").insert({type: 'info', message: 'refreshAssignments called'})

    // const { data } = await supabase.from("test").select();
    const user = await supabase.auth.getUser()
    const session = await supabase.auth.getSession();
    
    const token = session?.data?.session?.provider_token;

    

    const {data, error} = await supabase.from("msTeamsClasses")
                        .select("id, displayName")
                        .in("displayName", ['23-11CS', '23-10CS', 
                        '23-13BS', '23-12BS', '23-11BS1', '23-11BS2', '23-11BS1', '23-10BS1', '23-10BS2',
                        '23-11EC1', '23-11EC', '23-10EC', '23-10EC1',
                        '23-11IT', '23-10IT'])

    
    data?.map(async (d) => {

      const url = `https://graph.microsoft.com/v1.0/education/classes/${d.id}/assignments`
      
      console.log(url);

      const myAssignments = await callFullApi(url, token!);

      console.log(myAssignments);

      const upsertData = myAssignments.map((a:any) => ({
        id: a.id,
        classId: a.classId,
        displayName: a.displayName,
        dueDateTime: a.dueDateTime,   
        instructions: a.instructions?.content,
        status: a.status,
        webUrl: a.webUrl 
      }))
  
      for (const ud of upsertData){
        if (ud.instructions != null) {
          console.log(ud.instructions)
        }
        const {error} = await supabase.from("msTeamsAssignments").upsert(ud)
        !error && await supabase.from("log").insert({type: 'info', message: `Added ${ud.id}`}); 
        error && await supabase.from("log").insert({type: 'error', message: error.message});
        error && console.error(error) 
      }

      await supabase.from("log").insert({type: 'info', message: 'refreshAssignments complete'})

    })
    // return <pre>Supabase working! {JSON.stringify(user, null, 2)}</pre>
    // const me = await callApi("https://graph.microsoft.com/v1.0/me", token!);
    //const myClasses = await callFullApi("https://graph.microsoft.com/beta/education/me/classes", token!);
    
  } 

  return (
    <>
    <div>{JSON.stringify(token)}</div>
    <form action={refreshClasses}>
      <button type="submit" disabled={!token}>Resfresh Classes</button>
    </form>

    <form action={refreshAssignments}>
      <button type="submit" disabled={!token}>Resfresh Assignments</button>
    </form>

    </>
  )
}