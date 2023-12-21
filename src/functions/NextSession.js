"use client"
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {auth} from '../firebase'

function NextSession()
{
    const [authUser, setauthUser] = useState(null);
    const router = useRouter();
    
    useEffect(() => {
      onAuthStateChanged(auth, (authUser) => {
        setauthUser(authUser);
        return authUser
    })
    
      /*const unsubscribe = onAuthStateChanged(auth, (authUser) => {
        setauthUser(authUser);
        return authUser
        // Redirect to the dashboard if the user is already logged in
        /*if (!authUser) {
          router.push('/');
        }
      });
    
      // Cleanup function to unsubscribe from the listener
      return () => unsubscribe();*/
    });

    
}

const mainUser = NextSession();

export {mainUser}

