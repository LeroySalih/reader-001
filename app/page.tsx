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
  if(!session!.data!.session) {
    return <SignInButton />
  }
  const token = session!.data!.session!.provider_token;

  // return <pre>Supabase working! {JSON.stringify(user, null, 2)}</pre>
  const me = await callApi("https://graph.microsoft.com/v1.0/me", token!);
  const myClasses = await callFullApi("https://graph.microsoft.com/beta/education/me/classes", token!);
  const myAssignments = await callFullApi("https://graph.microsoft.com/v1.0/education/me/assignments", token!);

  /*
  const displayClass = (classId: string) => {
    {myClasses
      .filter((c) => c.id == classId)
      .map((c) => { return <div key={c.id}>
      <h2>{c.displayName}({c.mailNickname})</h2>
      <div className={styles.displayAssignmentTable}>
      {myAssignments
        .filter((f) => f.classId == c.id)
        .sort((a, b) => a.dueDateTime < b.dueDateTime ? 1: -1)
        .map((a) => [<div>{a.displayName}</div>,<div>{a.dueDateTime}</div>])}
      </div>
    </div>})}
  }
  */

  const displayClass = (displayName: string) => {
    
    if (displayName == ''){
      return <div className={`${styles.emptyCell}`}></div> 
    }

    const classObj = myClasses.filter((f:any) => f && f.displayName == displayName)[0];
    const assignmentsForClass = myAssignments
            .filter((a:any) => classObj && a.classId == classObj.id)
            .sort((a:any, b:any) => a.dueDateTime > b.dueDateTime ? -1 : 1);

    if (classObj == null) 
      return <div>{displayName} not found</div>
    const weeks = checkWeek(parseISO(assignmentsForClass[0]?.dueDateTime));

    return <div>
            <div className={`${styles.cell} ${checkWeekStyle(weeks)}`}>
              <div>{classObj?.displayName}</div>
              
              <div>{assignmentsForClass[0]?.dueDateTime.substring(0, 10)}</div>

            </div>
          </div>
  }

  const currentWeek = () => {
    return getWeek(new Date(), {weekStartsOn: 0});
  }

  const checkWeek = (dueDateTime: number | Date) => {  
    return getWeek(dueDateTime, {weekStartsOn: 0}) == Number.NaN ? -5 : getWeek(dueDateTime, {weekStartsOn: 0}) - currentWeek()
  }

  const checkWeekStyle = (weeks: number) => {
    if (weeks > 1) return styles.ltNOne;
    if (weeks == 1) return styles.nOne;
    if (weeks == 0) return styles.zero;
    if (weeks == -1) return styles.pOne;
    return styles.gtPOne;


  }

  

  if (me.name == "AxiosError" )
    return <>
      <SignInButton />
      <pre>{JSON.stringify(me, null, 2)}</pre>
    </>

  return (
    <>
    <div>{JSON.stringify(data, null, 2)}</div>
      <SignInButton />
      <div>Current Week: {currentWeek()}</div>
      <div className={styles.weekScale}>
        <div className={styles.gtPOne}>&gt; 1 week ago</div>
        <div className={styles.pOne}>1 week ago</div>
        <div className={styles.zero}>This week</div>
        <div className={styles.nOne}>Next week</div>
        <div className={styles.ltNOne}>More than next week</div>
        
      </div>

      <div className={styles.displayClasses}>
        <div>7</div>
        <div>8</div>
        <div>9</div>
        <div>10</div>
        <div>11</div>
        <div>12</div>
        <div>13</div>

        <div>{displayClass('23-7A/IT1')}</div>
        <div>{displayClass('23-8AIT1')}</div>
        <div>{displayClass('23-9AIT1')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>

        <div>{displayClass('23-7B/It1')}</div>
        <div>{displayClass('23-8BIT1')}</div>
        <div>{displayClass('23-9BIT1')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>

        <div>{displayClass('23-7C/It1')}</div>
        <div>{displayClass('23-8CIT1')}</div>
        <div>{displayClass('23-9CIT1')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>

        <div>{displayClass('23-7D/It1')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>

        <div>{displayClass('23-7A/Dt1')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('23-9A/Dt')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>

        <div>{displayClass('23-7B/DT1')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('23-9B/Dt')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>

        <div>{displayClass('23-7C/Dt1')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('23-9C/Dt')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>

        <div>{displayClass('23-7D/Dt1')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('23-10BS1')}</div>
        <div>{displayClass('23-11BS1')}</div>
        <div>{displayClass('23-12BS')}</div>
        <div>{displayClass('23-13BS')}</div>
        
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('23-10BS2')}</div>
        <div>{displayClass('23-11BS2')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('23-10EC')}</div>
        <div>{displayClass('23-11EC1')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('23-10EC1')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('23-10DT')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        <div>{displayClass('')}</div>
        

      </div>

     
    </>
  )
}
