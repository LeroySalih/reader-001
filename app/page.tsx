import styles from './page.module.css'
import { createClient } from "./utils/supabase/server";

import TeamsAssignmentsRefresh from "@/app/components/teams-assignments-refresh";
import TeamsHomeworkRefresh from "@/app/components/teams-homework-refresh";
import FormativesHomeworkRefresh from "@/app/components/formatives-homework-refresh";

export default async function Home() {

  const supabase = createClient();

  const user = await supabase.auth.getUser()
  const session = await supabase.auth.getSession();
  
  const token = session?.data?.session?.provider_token;

  if (!token) {
    return (
      <h1>User not signed in</h1>
    )
  }

  return (
    <>
    <h1>Welcome {user.data.user?.email}</h1>
    <div className={styles.displayCards} >
      <TeamsAssignmentsRefresh/>
      <TeamsHomeworkRefresh/>
      <FormativesHomeworkRefresh/> 
    </div>
    </>
  )
}