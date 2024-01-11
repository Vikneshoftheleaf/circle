"use client";
import { useState, useEffect, useContext, createContext } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebase'
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, onSnapshot, QuerySnapshot } from "firebase/firestore";
import SpinLoading from '@/components/spinLoading';
export const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({
    children,
}) => {
    const router = useRouter()
    const [user, setUser] = useState(null);
    const [profile,setProfile]=useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
                router.push('/')
            }
            setLoading(false)
        });
        return () => unsubscribe();
    },[auth]);


    useEffect(()=>{
        if(user){
            const unsub = onSnapshot(doc(db, "user", user.uid), (doc) => {
                const newData = doc.data()
                setProfile(newData)
            });
            return unsub;        
        }
    },[user])

    useEffect(()=>{
        if(profile){
            if(profile.userName == null)
            {
                router.push('/account/create')
            }
            
        }
    },[profile])
    return (
        <AuthContext.Provider value={{ user, profile }}>
            {loading ? <div className='h-screen w-full flex justify-center items-center'><SpinLoading h={50} w={50}/></div> : children}
        </AuthContext.Provider>
    );
};
