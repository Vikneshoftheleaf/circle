"use client";
import {useState,useEffect,useContext,createContext} from 'react'
import { onAuthStateChanged } from "firebase/auth";
import {auth} from '../firebase'
import { useRouter } from 'next/navigation';
export const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({
    children,
}) => {
    const router = useRouter()
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                router.push('/account/profile')
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    useEffect(() => {
        if (user == null) router.push("/")
    }, [user])

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};