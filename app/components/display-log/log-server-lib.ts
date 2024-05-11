"use server"

import { createClient} from "@/app/utils/supabase/server";

export const clearServerLog = async () => {
    
    console.log("Clearing Log");

    const supabase = createClient();

    const {data, error} = await supabase.from("log").delete().neq("id", 0) 

    if (error) {
        console.error(error);
    }

    return {data, error};

}

export const loadServerLog = async () => {

    const supabase = createClient();

    const {data, error} = await supabase.from("log")
                            .select("*")
                            .order("created_at", {ascending: false})
                            //.limit(10);
    error && console.error(error);
    
    return {data, error};
}