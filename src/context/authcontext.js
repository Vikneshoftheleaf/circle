"use client";
import { useState, useEffect, useContext, createContext, use } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, onSnapshot, QuerySnapshot, updateDoc } from "firebase/firestore";
import SpinLoading from '@/components/spinLoading';
export const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({
    children,
}) => {
    const router = useRouter()
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                updateDoc(doc(db, 'user', user.uid),
                {
                    isOnline: true
                })

            } else {

                setUser(null);
                setLoading(false)
                router.push('/')
            }
        });
        return () => unsubscribe();
    }, [auth]);

    function handleBeforeUnload()
    {
        if(user != null)
        {
            updateDoc(doc(db, 'user', user.uid),
            {
                isOnline: false
            })

        }

    }

    useEffect(()=>{

        window.addEventListener('beforeunload', handleBeforeUnload);

    })



    useEffect(() => {
        const handleOnline = () => {
            if(user != null)
            {
                updateDoc(doc(db, 'user', user.uid),
                {
                    isOnline: true
                })

            }
        };

        const handleOffline = () => {
            if(user != null)

            {
                updateDoc(doc(db, 'user', user.uid),
                {
                    isOnline: false
                })


            }
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (user) {
            const unsub = onSnapshot(doc(db, "user", user.uid), (doc) => {
                const newData = doc.data()
                setProfile(newData)
            });
            return unsub;
        }
    }, [user])

    useEffect(() => {
        if (profile != null) {
            setLoading(false)
            if (!profile.isEmailVerified) {
                router.push('/verify')
            }
            else if (profile.userName == null) {
                router.push('/account/create')
            }

        }
    }, [profile])
    return (
        <AuthContext.Provider value={{ user, profile }}>
            {loading ? <div className='h-screen w-full flex justify-center items-center'><SpinLoading h={8} w={8} /></div> : children}
        </AuthContext.Provider>
    );
};
