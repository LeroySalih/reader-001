"use server"

import { dbLog } from "@/app/api/lib";
import {createClient} from "@/app/utils/supabase/server";
import { callFullApi } from "@/app/api/lib"; 

// before updating the assignments, delete the old ones.
export const clearAssignments = async () => {
    
    await dbLog("INFO", `Started Planning Update`)  

    const supabase = createClient();

    const {data, error} = await supabase.from("msTeamsAssignments")
                                .delete()
                                .neq("id", "02d75d23-03a4-4d14-9083-8285de4b0e11")
                                .select("displayName")
                                
      
    if (data != null){
        console.log(`Deleted ${data.length} item(s)`)
        dbLog("INFO", `Deleted ${data.length} item(s)`)  
    }                               
    
    error && console.error(error);

    await dbLog("INFO", `Completed Planning Update`)
    return {status:"OK", data, error}
}


export const getUserToken = async () => {

    const supabase = createClient();

    const session = await supabase.auth.getSession();
  
    const token = session?.data?.session?.provider_token;

    if (!token){
      dbLog(   "error", "No token found")
      return null;
    } ;

    return token;
}

export const getClassIds = async (displayNames: string[]) => {
    const supabase = createClient();

    const {data, error} = await supabase.from("msTeamsClasses")
                          .select("id, displayName")
                          .in("displayName", displayNames);

    error && console.error(error);

    return {data, error};

}

export const getAssignmentsForClassIdFromTeams = async (token: string, classId: {id: string, displayName: string}) => {

    const url = `https://graph.microsoft.com/v1.0/education/classes/${classId.id}/assignments`
                    
    const myAssignments = await callFullApi(url, token!);
    dbLog("info", `Received: ${myAssignments.length} assignments for ${classId.displayName}`);
        
    // convert MS Graph Assignments to the format we want
    const assignments = myAssignments.map((a:any) => ({
            id: a.id,
            classId: a.classId,
            displayName: a.displayName,
            dueDateTime: a.dueDateTime,   
            instructions: a.instructions?.content,
            status: a.status,
            webUrl: a.webUrl 
    }));

    return assignments;
}

type Assignment = {
    id: string,
    classId: string,
    displayName: string,
    dueDateTime: string,   
    instructions: string,
    status: string,
    webUrl: string 
}
export const upsertAssignment = async (assignment: Assignment) => {
    const supabase = createClient();

    const {data, error} = await supabase.from("msTeamsAssignments").upsert(assignment, {onConflict:"id"})

    if (error) {
        dbLog("error", error.message)
    }

    return {data, error}
}


export const getAssignmentsFromTeams = async (token: string, classIds: {id : string, displayName: string}[]) => {
    
    const supabase = createClient();
    
    const myUpsertData: any = [];

    //@ts-ignore
    const asyncRes = await Promise.all(classIds?.map(async (d) => {

        const url = `https://graph.microsoft.com/v1.0/education/classes/${d.id}/assignments`
                    
        const myAssignments = await callFullApi(url, token!);
        dbLog("info", `Received: ${myAssignments.length} assignments`)
        
        // convert MS Graph Assignments to the format we want
        const upsertData = myAssignments.map((a:any) => ({
            id: a.id,
            classId: a.classId,
            displayName: a.displayName,
            dueDateTime: a.dueDateTime,   
            instructions: a.instructions?.content,
            status: a.status,
            webUrl: a.webUrl 
        }));

        // ?
        myUpsertData.push(upsertData);

        // loop through our form assignments, and upsert each one
        for (const ud of upsertData){
                
            const {error} = await supabase.from("msTeamsAssignments").upsert(ud, {onConflict:"id"})
            //!error && dbLog("info", "Row Added");
            error && dbLog("error", error.message);
        }

    })); // end promise 

    dbLog("info", `Refresh completed for all classes`)
    return {status: "ok"}
}

const sleep = async (duration: number) => {

    return new Promise((res, rej) => {
        setTimeout( ()=> {res(true)}, duration) ;
    })
        
}


export const refreshPlanning = async () => {

    const classes = ['23-11CS', '23-10CS', 
    '23-13BS', '23-12BS', '23-11BS1', '23-11BS2', '23-11BS1', '23-10BS1', '23-10BS2',
    '23-11EC1', '23-11EC', '23-10EC', '23-10EC1', '23-10EC2',
    '23-11IT', '23-10IT',  '23-10DT']

    const {data, error} = await clearAssignments()
    if (error) {
        dbLog("error", error.message);
        return {data: null, error: error.message}
    } 

    const token = await getUserToken();

    if (token === null) {
        return {data: null, error: "No User Token Found"}
    }

    await dbLog("info", `User token found ${token.substring(0, 6)}`);

    // get Class Ids of selected classes
    const {data: classIds, error: classIdErrors} = await getClassIds(classes);

    await dbLog("info", `Retrieved ids for ${classIds?.length} classes`)

    for (const classId of classIds!) {

        // get assignments for this classId
        const assignments = await getAssignmentsForClassIdFromTeams(token as string, classId);

        for (const assignment of assignments){
            await upsertAssignment(assignment);
        }

        // add a 1 sec delay to avoid limiting errors
        await sleep(500);
    }
    
    await dbLog("info", "Refresh Completed");
    
    return {data: null, error: null};

    return;
}
