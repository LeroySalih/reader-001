
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import axios from 'axios';

export async function dbLog(type: string, message: string) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
    await supabase.from("log").insert({type, message}); 
  }

export async function callApi (uri: string, token: string) {

    const options = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    console.log(`request made to ${uri} at:  ${new Date().toString()}`);

    try {
      const response = await axios.get(uri, options);
      return response.data;
    } catch (error) {
        console.error(error)
        return error;
    }

}; 

export async function callFullApi(uri : string, token : string) {

  // console.log("Calling MS Graph API", uri, token);

  let values:any = [];

  let response = await callApi(uri, token);

  values = values.concat(response.value);

  while (response['@odata.nextLink']) {
    console.log("nextLink detected", response['@odata.nextLink'])
    response = await callApi(response['@odata.nextLink'], token);
    values = values.concat(response.value);
  }
  // console.log(response.value);
  
  //values = values.concat(response.value);

  return values;
}
