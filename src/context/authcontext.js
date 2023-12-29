"use client";
import { useState, useEffect, useContext, createContext } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebase'
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, onSnapshot, QuerySnapshot } from "firebase/firestore";
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
                //router.push('/account/profile')
            } else {
                setUser(null);
            }
            setLoading(false)
        });
        return () => unsubscribe();
    });



    useEffect(() => {
        if (user == null) router.push("/")
    }, [user])


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
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};