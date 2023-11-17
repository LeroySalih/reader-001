import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime"
import axios from 'axios';
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { format, formatDistance, formatRelative, subDays, startOfWeek, addWeeks, subWeeks, differenceInWeeks, differenceInDays } from 'date-fns'
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
    
    const {cell: [classId, week]} = params;

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

    const { data } = await supabase.from("test").select();
    const user = await supabase.auth.getUser()
    const session = await supabase.auth.getSession();

    const token = session!.data!.session!.provider_token;

    const buildClasses = (classes: any, weeks: any, filterClasses: any) => {
        // console.log(classes)
        return classes
                  .filter((c:any) => filterClasses.includes(c.displayName))
                  .reduce((p: any, c: any) => { p[c.id] = {displayName: c.displayName, weeks: {}}; return p}, {})
      }
  
      const buildAssignments = (classes : any, assignments: any) => {
  
        const assignmentsArray = []
  
        // classId, displayName, dueDateTime
        for (const assignment of assignments.filter((f:any) => f.status !== 'draft' || f.status !== 'scheduled')){
          // look up the class id of assignment.
          const cId = assignment.classId;
          const dueDateTimeWeek = format(startOfWeek(parseISO(assignment.dueDateTime)), "yyyy-MM-dd");
          
          //console.log(cId, dueDateTimeWeek, classes[cId]?.weeks[dueDateTimeWeek]);
          
          if (classes[cId] && !classes[cId].weeks[dueDateTimeWeek]){
            // classes[cId].weeks[dueDateTimeWeek] = 0;
            classes[cId].weeks[dueDateTimeWeek] = [];
          }
  
          if (!classes[cId]) {
            console.error(`Class not found:`, cId, assignment.displayName)
          } else {
            if (assignment.status === 'assigned'){
              assignmentsArray.push({classId: classes[cId].id, classDisplayname: classes[cId].displayName, title: assignment.displayName, dueDate: dueDateTimeWeek })
              // classes[cId].weeks[dueDateTimeWeek] = [...classes[cId].weeks[dueDateTimeWeek], assignment.displayName] // classes[cId].weeks[dueDateTimeWeek] + 1
            }
            
          }
          
  
        }
        return assignmentsArray; //classes//.reduce((p: any, c: any) => {return p[c.displayName] = c}, {});
      }

    // return <pre>Supabase working! {JSON.stringify(user, null, 2)}</pre>
    //const me = await callApi("https://graph.microsoft.com/v1.0/me", token!);
    const myClassesArr = await callFullApi("https://graph.microsoft.com/beta/education/me/classes", token!);
    const myClassesObj = buildClasses(myClassesArr, weeks, filterClasses)

    const myAssignmentData = await callFullApi("https://graph.microsoft.com/v1.0/education/me/assignments", token!);
    const myAssignmentArr = buildAssignments(myClassesObj, myAssignmentData)

  
    const getAssignmentsForClassWeek = (myAssignmentArr:any, classDisplayName:any, week:any) => {

      const result = myAssignmentArr.filter((a:any) => a.dueDate == week && a.classDisplayname == classDisplayName)

      return result;
    }

    const assignments = getAssignmentsForClassWeek(myAssignmentArr, classId, week);

    return <>
    <hr/>
    <h2>{classId} for week {week}</h2>
    {
        getAssignmentsForClassWeek(myAssignmentArr, classId, week).map((a: any, i: any) => <div key={i}>

            <h4>{a.title}</h4>
            <div className={styles.subTitle}>
                <div>Due Date: {a.dueDate}</div>
                <div>{a.classDisplayname}</div>
            </div>
            </div>)
    }
    
    </>
}
