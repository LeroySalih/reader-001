
import {createRouteHandlerClient} from "@supabase/auth-helpers-nextjs"
import {cookies} from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

    console.log("Route called");
    
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = createRouteHandlerClient({cookies});
        console.log(code);
        await supabase.auth.exchangeCodeForSession(code);
    }

    console.log("Origin:", requestUrl)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log("BaseUrl", baseUrl)
    Object.keys(process.env).forEach((k) => k.includes('NEXT_PUBLIC') && console.log(k));
    // console.log(process.env);
    return NextResponse.redirect(`${baseUrl}${requestUrl.search}`);
}