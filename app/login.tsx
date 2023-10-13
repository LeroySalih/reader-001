"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";




export default function SignInButton() {

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClientComponentClient();

    async function signInWithAzure() {
        

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'azure',
          options: {
            scopes: 'email',
            redirectTo: `${location.origin}/auth/callback`
          },
        })
      }

    async function signOut() {
      await supabase.auth.signOut();
    }

    const handleSignIn = () => {
        console.log("Clicked");
        signInWithAzure();
    }

    const handleSignOut = () => {
        console.log("Signing Out");
        signOut;
    }

    return <>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleSignOut}>Sign Out</button>
    </>

}