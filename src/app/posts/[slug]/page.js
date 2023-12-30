import BackBtn from "@/components/backBtn";

export default function ViewPosts({params}){
    const {profile} = useAuthContext();

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cref = collection(db, 'posts')
        const q = query(cref, orderBy("title", "desc"));
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            setPosts(QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))

        })
        return unsubscribe;
    }, [])

    useEffect(() => {
        if (posts) {
            setLoading(false)
        }
    }, [posts])

if(loading){
return(<><h1>Users Posts...</h1></>)
}
else{
    return (
        <div className="m-5"> 
            <div>
                {posts.map(post => <Posts  key={post.id} data={post} profile={profile}/>)}
            </div>
        </div>

    )
}}
