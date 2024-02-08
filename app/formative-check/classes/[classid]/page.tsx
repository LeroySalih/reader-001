
import { SupabaseClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import styles from './formative-check.module.css';

const getData = async (supabase: SupabaseClient<any,"public", any>, classid : string ) => {

    let { data, error } = await supabase.from('vw_formative_class_unit_progress').select("classId, unit, Pct").eq("classId", classid)

    
    if (error) console.error(error)
    else console.log(data)

    return {data, error};

}

const Page = async ({params}: {params: {classid: string}}) => {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const user = await supabase.auth.getUser()
    const session = await supabase.auth.getSession();

    const {classid} = params;

    // const classid = "23-10DT"
    //const unit = "Core 3"

    console.log("Getting")
    const {data, error} = await getData(supabase, classid);

    return <>
        <h1>Formative Check</h1>
        <h3>{classid}</h3>
        <div><a href="/formative-check/classes">Back</a></div>
        <div className={styles.displayPupilScores}>
            
            <div>Unit</div>
            <div>%</div>
            
            {
                data && data.reduce((prev: string[], curr: {classId: string, unit: string, Pct: string }) => {
                    
                    prev.push(curr.unit)
                    prev.push((parseFloat(curr.Pct || "0") * 100).toFixed(0)); 
                    return prev
                }, []).map((o: string, i: number) => <div key={i}>{o}</div>)
            }
            
        </div>
    </>
}


export default Page