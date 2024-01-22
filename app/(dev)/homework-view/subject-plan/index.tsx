import axios from 'axios';
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { format, formatDistance, formatRelative, subDays, startOfWeek, addWeeks, subWeeks, differenceInWeeks, differenceInDays, endOfWeek } from 'date-fns'
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
    '23-13BS', '23-12BS', '23-11BS1', '23-11BS2',   '23-10BS1', '23-10BS2',
    '23-11EC1',  '23-10EC', '23-10EC1', '23-10EC2',
    '23-11IT', '23-10IT',
    '23-10DT'
  ]

export default async function SubjectPlan () {

    const startOfThisWeek = startOfWeek(new Date())  
    const threeWeeksPast = subWeeks(startOfThisWeek, 3)
    const threeWeeksFuture = addWeeks(startOfThisWeek, 3)
    const weeks = []
    for (let i = 0; i < 6; i++){
      //@ts-ignore
      weeks.push(format(addWeeks(threeWeeksFuture, -i), "yyy-MM-dd"))
    }

    // const {classid} = params;

    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore })



    const getAssignmentsFromDB = async (filterClasses:any) => {

      const {data: classesArr, error} = await supabase.from("msTeamsAssignments")
                                                      .select("id, msTeamsClasses(displayName), displayName, dueDateTime, status")
                                                      .order("displayName")

        if (error) {
          console.error(error)
          return null;
        }
        
        return classesArr
    } 

    const assignmentsArr = await getAssignmentsFromDB(filterClasses);
  
    const getAssignmentsForClassWeek = (myAssignmentArr:any, classDisplayName:any, week:any) => {

      const weekStart = startOfWeek(parseISO(week)).toISOString();
      const weekEnd = endOfWeek(parseISO(week)).toISOString();

      console.log(weekStart, weekEnd);

      const result = myAssignmentArr
            .filter((a:any) => a.msTeamsClasses.displayName == classDisplayName 
            && a.dueDateTime >= weekStart 
            && a.dueDateTime < weekEnd 
            && (a.status == "assigned" || a.status == "scheduled")
            )

      return result;
    }

    // calculate the style of the cell
    const cellFormat = (w: string, num: number) => {

      const diff = Math.max(differenceInWeeks(parseISO(w), startOfThisWeek), 0)
      return num == 0 ? styles[`red${diff}`] : styles[`green${diff}`]
      
    }

    // if its the current date in the display grid, change the row stye
    const isCurrent = (w: string) => {
      return differenceInDays(parseISO(w), startOfThisWeek) === 0 ? styles.current : ''
    }

    return <>
    <h1>Subject Plan for {format(startOfThisWeek, "yyy-MM-dd")}</h1>
   
    <div 
      className={styles.displayGrid} 
      style={{"gridTemplateColumns": `repeat(${filterClasses.length + 1}, 1fr)`}}> 
      <div></div>
      {
        filterClasses.map((classDisplayName:any) => <div className={styles.tableHeader}>
         <Link href={`/homework-view/subject/${classDisplayName}`}> {classDisplayName.substring(3,8)}</Link>
        </div>)
      }

      {weeks.map((w: any) => {return [
      <div className={styles.tableHeader}>{w.substring(5,10)}</div>, 
      ...filterClasses.map(
        (classDisplayName:any, i:number) => {
        
        const count = getAssignmentsForClassWeek(assignmentsArr,classDisplayName, w ).length;

        return <div key={i} className={`${styles.cell} ${cellFormat(w, count)} ${isCurrent(w)}`}>
        {
            count > 0 ? <Link href={`/homework-view/cell/${classDisplayName}/${w}`}>{
                count 
                }
                </Link> : count    
        }
        
        </div>
        })
      ]})}
    </div>

   

</>
}