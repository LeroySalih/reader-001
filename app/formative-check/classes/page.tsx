
import { SupabaseClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import styles from './formative-check.module.css';

const getData = async (supabase: SupabaseClient<any,"public", any> ) => {

    let { data, error } = await supabase.from('vw_formative_class_unit_progress').select("classId, unit, Pct")

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
        
        { data && DisplayClassProgress ("23-11-BS1", data) }
        { data && DisplayClassProgress ("23-11-BS2", data) }
        { data && DisplayClassProgress ("23-10BS1", data) }
        { data && DisplayClassProgress ("23-10-BS2", data) }
                

        { data && DisplayClassProgress ("23-10DT", data) }
        

    </>
}


const DisplayClassProgress = (classId:string, data: {unit: string, classId: string, Pct: number}[]) => {

    const filtered = data.filter((c) => c.classId == classId);

    const unitProgress = filtered.reduce((prev, cur) => prev + cur.Pct, 0) / filtered.length

    return <>
        
        <div className={styles.displayPupilScores}>
            <div><h1>{classId} </h1></div>
            <div><h1>({(unitProgress * 100).toFixed()}%)</h1></div>
       
        {data && data
            .filter(c => c.classId == classId)
            .sort((a,b) => a.unit > b.unit ? 1 : -1)
            .map((u, i) => [<div>{u.unit}</div>, <div>{(u.Pct*100).toFixed(0)}</div>])
        }
        </div>
        </>
}


export default Page