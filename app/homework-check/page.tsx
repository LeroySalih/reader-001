import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const Page = async () => {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const {data, error} = await supabase.from("vw_teams_homework_marked").select("*");

    if (error) {
        console.log(error);
    }
    return <>
        <h1>Homework Check</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
}


export default Page;