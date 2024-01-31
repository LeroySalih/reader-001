
import { SupabaseClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import styles from './formative-check.module.css';

const getData = async (supabase: SupabaseClient<any,"public", any>, classid : string, unit: string ) => {

    let { data, error } = await supabase
    .rpc('fmt_get_formative_points', {classid, unit})
    
    if (error) console.error(error)
    // else console.log(data)

    return {data, error};

}

const Page = async ({params}: {params: {classid: string, unit: string}}) => {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const user = await supabase.auth.getUser()
    const session = await supabase.auth.getSession();

    const {classid, unit} = params;

    // const classid = "23-10DT"
    //const unit = "Core 3"

    const {data, error} = await getData(supabase, classid, decodeURIComponent(unit));

    return <>
        <h1>Formative Check</h1>
        <h3>{classid}</h3>
        <h3>{decodeURIComponent(unit)}</h3>
        <div className={styles.displayPupilScores}>
            <div>First Name</div>
            <div>Last Name</div>
            <div>%</div>
            
            {
                data && data.sort((a: {pct:number}, b: {pct: number}) => a.pct < b.pct ? 1 : -1)
                    .reduce((prev: string[], curr: {studentfirstname: string, studentlastname: string, pct: string }) => {
                    prev.push(curr.studentfirstname);
                    prev.push(curr.studentlastname)
                    prev.push((parseFloat(curr.pct) * 100).toFixed(0)); 
                    return prev
                }, []).map((o: string, i: number) => <div key={i}>{o}</div>)
            }
            
        </div>
    </>
}


export default Page