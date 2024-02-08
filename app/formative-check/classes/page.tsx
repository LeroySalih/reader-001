
import { SupabaseClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import styles from './formative-check.module.css';

const getData = async (supabase: SupabaseClient<any,"public", any> ) => {

    let { data, error } = await supabase.from('vw_formative_class_progress').select("classId, progress")

    if (error) console.error(error)
    else console.log(data)

    return {data, error};

}

const Page = async () => {

    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const user = await supabase.auth.getUser()
    const session = await supabase.auth.getSession();

    

    // const classid = "23-10DT"
    //const unit = "Core 3"

    console.log("Getting Data")
    const {data, error} = await getData(supabase);

    return <>
        <h1>Formative Check</h1>
        
        
        <div className={styles.displayPupilScores}>
            
            <div>Class Id</div>
            <div>Progress</div>

            {
                data && data.map((c:any, i:number) => [
                    <div>
                        <a href={`/formative-check/classes/${c.classId}`}>{c.classId}</a>
                    </div>, 
                    <div>
                        {(c.progress * 100).toFixed(0)}%
                    </div>])
            }
            
           
            
        </div>
    </>
}


export default Page