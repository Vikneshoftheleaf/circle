'use client'

import { auth, db } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, } from "firebase/auth";
const provider = new GoogleAuthProvider();
import { doc, setDoc } from "firebase/firestore";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";


export default function SignupForm() {


    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const errorRef = useRef();


    


    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }

        return randomString;
    }

    function googleSignup() {
        signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            const [displayName] = user.email.split('@')
            setDoc(doc(db, "user", user.uid), {
              uid: user.uid,
              userName:null,
              descrip:null,
              displayName: user.displayName ? user.displayName : displayName[0],
              email: user.email,
              photoURL: user.photoURL ? user.photoURL : null,
              followers: 0,
              following: 0,
              posts: 0,
              followedBy:[],
              followingBy:[],
              verified: false,
              isEmailVerified: true
      
            }).then(()=>sendCode('welcome',null, user.email, user.displayName));
            // IdP data available using getAdditionalUserInfo(result)
            console.log("signned up with google!")
      
            // ...
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            
            console.log(errorMessage)
            // ...
          });
      }

      function emailSignup(e, email, password) {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            const displayName = user.email.split('@')
            const verifyCode = generateRandomString(6)
            setDoc(doc(db, "user", user.uid), {
              uid: user.uid,
              userName:null,
              descrip:null,
              displayName: user.displayName ? user.displayName : displayName[0],
              email: user.email,
              photoURL: user.photoURL ? user.photoURL : null,
              followers: 0,
              following: 0,
              posts: 0,
              followedBy:[],
              followingBy:[],
              verified: false,
              isEmailVerified:false,
              emailVerifyCode:verifyCode

      
            })
            console.log('siggned in with email!')

            getData(verifyCode, user.email)
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
            const errMsg = errorCode.split('/')
            errorRef.current.textContent = errMsg[1];
      
            // ..
          });

      }

      async function getData(vcode, vemail) {

        const type = "verify";
        const code = vcode;
        const email = vemail
        const res = await fetch('/api/mail',{
          method:'POST',
          headers:{
            'content-type':'application/json'
          },
          body: JSON.stringify({
            type,
            code,
            email
          })
        })

        const data = await res.json()
        console.log(data)
      }

      async function sendCode(type, code, email, name) {

        const res = await fetch('/api/mail',{
          method:'POST',
          headers:{
            'content-type':'application/json'
          },
          body: JSON.stringify({
            type,
            code,
            email,
            name
          })
        })

        const data = await res.json()
        console.log(data)
      }

    return (
        <div className="m-10 flex flex-col pt-5 justify-center items-center h-full gap-4">
            <div className="lg:w-1/4 flex flex-col gap-4">
                <div className="flex flex-col gap-4 text-center">
                    <h1 className="text-4xl font-bold">Sign up for Circle!</h1>
                    <p className="text-sm">Let's start your social networking journey from here.</p>
                </div>
                <div>
                    <p className="text-red-500 text-sm text-center" ref={errorRef}></p>
                </div>
                <form onSubmit={(e) => emailSignup(e, email, password)} className="flex flex-col gap-4 ">
                    <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="rounded-md dark:border-0 border-2 p-2" placeholder="Email" />
                    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" className="rounded-md dark:border-0 border-2 p-2" placeholder="Password" />
                    <button className="px-4 py-2 bg-red-500 text-slate-100 rounded-md font-medium" type="submit">Sign Up</button>
                </form>

                <div className="flex gap-2 text-center justify-center items-center text-sm">
                    <h1>Already have an account?</h1><Link href={'/login'} className="text-red-500 font-medium">Log In</Link>
                </div>

                <div className="flex justify-between items-center gap-2">
                    <hr className="h-[2px]  bg-gray-200 w-full rounded-full" />
                    <h1>Or</h1>
                    <hr className="h-[2px] bg-gray-200  w-full rounded-full" />
                </div>

                <button className="px-4 py-2 dark:border-0 dark:bg-white/10 dark:backdrop-blur-sm border-2 flex items-center justify-center gap-4 rounded-md" onClick={() => googleSignup()}>
                    <Icon icon="devicon:google" />
                    <h1>Continue with Google</h1>
                </button>

            </div>

        </div>
    )
}