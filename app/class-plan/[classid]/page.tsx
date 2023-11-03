
import axios from 'axios';
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import SignInButton from '../../login';
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import parseISO from 'date-fns/parseISO'
import styles from './page.module.css';

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

export default async function Home({ params }: { params: { classid: string } }) {

    const {classid} = params;

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

    const myClass = myClasses.filter((c: any) => c?.displayName == classid)[0];

    const classes = ['23-11CS', '23-10CS']
    return <>
        <h1>Class Plan {classid}</h1>
        <div>
          {classes.map((c, i) => <span key={i}><a  href={`/class-plan/${c}`}>{c}</a> | </span>)}
        </div>
        <div className={styles.displayGrid}>
        {myAssignments
            .filter((c: any) => c.classId == myClass.id)
            .map((a: any,i: any) => [<div key={i} className={styles.row}><a target="_new" href={a.webUrl}>{a.displayName}</a></div>,
                           <div className={styles.row}><div className={`${styles.pill} ${styles[a.status]}` }>{a.status}</div></div>,
                           <div className={styles.row}> {format(parseISO(a.dueDateTime),"yyyy-MM-dd")}</div>])}
        </div>
    </>
}