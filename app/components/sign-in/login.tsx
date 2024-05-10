"use client";
import { createClient } from "@/app/utils/supabase/client";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

import {useState, useEffect} from "react";
import { refreshSignIn } from "./refresh";

type Profile = {
  firstName: string, 
  familyName: string
}

export default function SignInButton() {

    const [user, setUser] = useState<User | null>(null);
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient();

    async function signInWithAzure() {
        
        const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}auth/callback`;
        console.log("redirectUrl", redirectUrl);
        
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'azure',
          options: {
            scopes: 'email',
            
            redirectTo: redirectUrl
          },
        });

        refreshSignIn();
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
        signOut();
        refreshSignIn();
    }

    useEffect( ()=> {

      const loadUser = async () => {
        
        const session = await supabase.auth.getSession();
        console.log("Session is ", session);
        // setSession(session);
        setUser(session?.data?.session?.user ?? null);

      }

      loadUser();
      
      const { data } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {

        console.log("Auth State Changed", session)

        console.log(event, session)

        if (event === 'INITIAL_SESSION') {
          // handle initial session
        } else if (event === 'SIGNED_IN') {
          // handle sign in event
        } else if (event === 'SIGNED_OUT') {
          // handle sign out event
        } else if (event === 'PASSWORD_RECOVERY') {
          // handle password recovery event
        } else if (event === 'TOKEN_REFRESHED') {
          // handle token refreshed event
        } else if (event === 'USER_UPDATED') {
          // handle user updated event
        }

        if (session == null) {
          setUser(null);
          refreshSignIn();
          return;
        }

        const {user} = session!;

        setUser(user);
        refreshSignIn();
      });

      return () => {data.subscription.unsubscribe()}

    }, []);

    return <>
      {user == null && <button onClick={handleSignIn}>Sign In</button>}
      {user != null && <div style={{display:"flex", justifyContent: "space-around", marginBottom: "0.5rem"}}>{user.email?.split("@")[0]}<button onClick={handleSignOut}>Sign Out</button></div>}
    </>

}