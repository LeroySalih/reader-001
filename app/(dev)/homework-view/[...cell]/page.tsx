import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime"
import axios from 'axios';
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { format, formatDistance, formatRelative, subDays, startOfWeek, endOfWeek, addWeeks, subWeeks, differenceInWeeks, differenceInDays } from 'date-fns'
import parseISO from 'date-fns/parseISO'
import styles from './page.module.css';
import Link from "next/link";


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

const filterClasses = [
    '23-11CS', '23-10CS', 
    '23-13BS', '23-12BS', '23-11BS1', '23-11BS2', '23-11BS2', '23-11BS1', '23-10BS1', '23-10BS2',
    '23-11EC1', '23-11EC', '23-10EC', '23-10EC1',
    '23-11IT1', '23-10IT'
  ]


export default async function Page({params}: {params: {cell: string[]}})  {
    
    const {cell: [classDisplayName, week]} = params;

    const startOfThisWeek = startOfWeek(new Date())  
    const threeWeeksPast = subWeeks(startOfThisWeek, 3)
    const threeWeeksFuture = addWeeks(startOfThisWeek, 3)
    const weeks = []
    for (let i = 0; i < 6; i++){
      //@ts-ignore
      weeks.push(format(addWeeks(threeWeeksFuture, -i), "yyy-MM-dd"))
    }

    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

      const getClassesFromDB = async (classDisplayName: string) => {

        console.log("building Classes FromDB")
        const {data: classesArr, error} = await supabase
              .from("msTeamsClasses")
              .select("id, displayName")
              .eq("displayName", classDisplayName);
        
        if (error) {
          console.error(error);
          return null;
        } 

        console.log("classesArr", classesArr);

        // const classesObj = classesArr!.reduce((p: any, c: any) => { p[c.id] = {displayName: c.displayName, weeks: {}}; return p}, {})
        
        return classesArr[0];
      }

      const getAssignmentsFromDB = async (classId:string, w:string) => {
        
        console.log("building Assignments FromDB")
        const weekStart = format(startOfWeek(parseISO(w)), "yyyy-MM-dd");
        const weekEnd = format(endOfWeek(parseISO(w)), "yyyy-MM-dd");
        console.log(classId, weekStart, weekEnd)
        const {data: assignmentsArr, error} = await supabase.from("msTeamsAssignments")
                .select("id, classId, displayName, status, dueDateTime")
                .eq("classId", classId)
                // .eq("status", "assigned")
                .gte("dueDateTime", weekStart)
                .lte("dueDateTime", weekEnd)
                ;
        
        if (error) {
          console.error(error);
          return null;
        } 

        console.log("classesArr", assignmentsArr);

        // const classesObj = classesArr!.reduce((p: any, c: any) => { p[c.id] = {displayName: c.displayName, weeks: {}}; return p}, {})
        
        return assignmentsArr;

      }
  
    // const assignments = getAssignmentsForClassWeek(myAssignmentArr, classId, week);
    const classObj = await getClassesFromDB(classDisplayName);
    const assignmentArr = await getAssignmentsFromDB(classObj!.id, week)

    return <>
    <hr/>
    <h2>{classDisplayName} for week {week}</h2>
    {
        assignmentArr && assignmentArr!.map((a: any, i: any) => <div key={i}>

            <h4>{a.displayName}</h4>
            <div className={styles.subTitle}>
                <div>Due Date: {a.dueDateTime}</div>
                <div>Status: {a.status}</div>    
            </div>
            </div>)
      
    }

    </>
}
