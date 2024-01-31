
import { SupabaseClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import styles from './formative-check.module.css';

const getData = async (supabase: SupabaseClient<any,"public", any> ) => {

    let { data, error } = await supabase.from('vw_formative_class_list').select("classId")

    
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
            <div>Class Id</div>
            
            {
                data && data.reduce((prev: string[], curr: {classId: string}) => {
                    
                    prev.push(curr.classId)
                    
                    return prev
                }, []).map((o: string, i: number) => <div key={i}>
                    <a href={`/formative-check/classes/${o}`}>{o}</a>
                </div>)
            }
            
        </div>
    </>
}


export default Page