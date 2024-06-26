
import {SupabaseClient} from "@supabase/supabase-js";
import { callFullApi } from "../../lib";

const parseContext = (url: string) => {

    const slots = url.split('/')

    return {classId: slots[6], assignmentId: slots[8], submissionId: slots[10]}
}

const parseOutcomesResponse = (responses: any) => {

  // console.log("responses", responses);

  const pointsOutcome = responses.filter((r:any) => r["@odata.type"] == '#microsoft.graph.educationPointsOutcome')

  console.log("pointsOutcome", pointsOutcome);

  if (pointsOutcome.length ==  1 && "points" in pointsOutcome[0] && pointsOutcome[0]["points"] != null){
    const points = pointsOutcome[0].points.points;
    console.log("points", points);
    const pointsObj = {outcomeId: pointsOutcome[0]["id"], points}
    console.log("pointsObj", pointsObj)
    return pointsObj; 
  }

  // no points assigned to assignment
  return {outcomeId: pointsOutcome[0]["id"], points: null} ;
    
}

const updateOutcomes = async (supabase:any, outcomes:any) => {

  try {

    console.log("outcomes", outcomes);
    
    const {data, error} = await supabase.from("outcomes").upsert(outcomes).select();

    console.log(data, error);

    if (error){
      throw (new Error(error))
    }

    return {data, error};

  }catch (error) {
    //@ts-ignore
    console.error(error.message);

    return {data: null, error};
  }
}

const getSubmissions = async (token: string, classId: string, assignmentId: string) => {


  const url = `https://graph.microsoft.com/beta/education/classes/${classId}/assignments/${assignmentId}/submissions/`;

  const resp = await callFullApi(url, token); 

  // console.log("Submissions", resp.map((s) => s.id));

  return resp.map((s: any) => ({id: s.id}));

}

const getOutcome = async (token: string, classId: string, assignmentId: string, submission: {id: string}) => {

  const url = `https://graph.microsoft.com/beta/education/classes/${classId}/assignments/${assignmentId}/submissions/${submission.id}/outcomes`;

  const resp = await callFullApi(url, token);

  const context = parseContext(url);

  const points = parseOutcomesResponse(resp);

  const outcome = Object.assign ({}, {...context}, {...points})

  console.log("outcome", outcome);

  return outcome;

}

export const refreshAssignment = async ( supabase: SupabaseClient<any, "public", any>, token: string, classId: string, assignmentId: string) => {

  await supabase.from("updateTracker").insert({table: "outcomes", event: "Update started"});

  const submissions = await getSubmissions(token, classId, assignmentId)

  const outcomes = []

  for (const submission of submissions) {
    console.log("Submission", submission)
    const outcome = await getOutcome(token, classId, assignmentId, submission )

    outcomes.push(outcome);  

  }

  const {data, error } = await updateOutcomes(supabase, outcomes);

  await supabase.from("updateTracker").insert({table: "outcomes", event: "Update completed"});

  return {data, error}

}