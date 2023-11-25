import Image from 'next/image'
import styles from './page.module.css'

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import RefreshAssignments from './components/refresh-assignments';
import SignInButton from './login';
import axios from 'axios';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import previousSunday from 'date-fns/previousSunday'
import nextSaturday from 'date-fns/nextSaturday'
import isThisWeek from 'date-fns/isThisWeek'
import getWeek from 'date-fns/getWeek'
import parseISO from 'date-fns/parseISO'
import DisplayLog from "./components/display-log";
import { dbLog } from './api/lib';
import ClearLog from './components/clear-log';

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

  return (
    <>
    
    <form action={refreshClasses}>
      <button type="submit" disabled={!token}>Resfresh Classes</button>
    </form>
    
    
    <RefreshAssignments/>
    <ClearLog/>
    <DisplayLog/>

    </>
  )
}