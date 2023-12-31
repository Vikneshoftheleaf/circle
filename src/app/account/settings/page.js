'use client'
import { useAuthContext } from "@/context/authcontext"
import { Icon } from "@iconify/react"
import { logOut } from "@/functions/functions";
import BackBtn from "@/components/backBtn";
import { db, storage } from "@/firebase";
import { deleteDoc, doc, onSnapshot, where, query, collection, getDocs, QuerySnapshot, } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Setting() {
    const { user } = useAuthContext();
    async function deleteAccount() {
        const notificationref = collection(db, 'notifications')
        const postPicRef = collection(db, 'posts')
        const postRef = collection(db, 'posts')
        const commentRef = collection(db, 'comments')
        const pq = query(postPicRef, where('author', '==', user.uid));
        const nq = query(notificationref, where('notificationTo', '==', user.uid));
        const postq = query(postRef, where('author', '==', user.uid));
        const cq = query(commentRef, where('cUserId', '==', user.uid));

        getDocs(nq)
            .then((QuerySnapshot) => {
                // Iterate through the documents
                QuerySnapshot.forEach((doc) => {
                    // Delete each document using deleteDoc with the document reference directly
                    deleteDoc(doc.ref)
                        .then(() => {
                            console.log('all notifications are deleted');
                        })

                });
            })

        getDocs(pq)
            .then((QuerySnapshot) => {
                // Iterate through the documents
                QuerySnapshot.forEach((doc) => {

                    const desertRef = ref(storage, `posts/${doc.data().postPicName}`);

                    // Delete the file
                    deleteObject(desertRef).then(() => {
                        console.log(' alll post pic deleted')
                    }).catch((error) => {
                        console.log(error)
                    })
                });
            })

        getDocs(postq)
            .then((QuerySnapshot) => {
                // Iterate through the documents
                QuerySnapshot.forEach((doc) => {
                    // Delete each document using deleteDoc with the document reference directly
                    deleteDoc(doc.ref)
                        .then(() => {
                            console.log('all posts are delted');
                        })

                });
            })

        getDocs(cq)
            .then((QuerySnapshot) => {
                // Iterate through the documents
                QuerySnapshot.forEach((doc) => {
                    // Delete each document using deleteDoc with the document reference directly
                    deleteDoc(doc.ref)
                        .then(() => {
                            console.log('all comments are deleted');
                        })

                });
            })

        const desertRef = ref(storage, `user/${user.uid}`);

        // Delete the file
        deleteObject(desertRef).then(() => {
            console.log('user Profile pic deleted')
        }).catch((error) => {
            console.log(error)
        });

        await deleteDoc(doc(db, "user", user.uid)).then(()=> logOut())

        


    }
    return (
        <div>
            <div className="flex justify-start gap-2 items-center p-2">
                <BackBtn />
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-4 p-5 text-xl">
                    <h1 className="flex gap-2 items-center"><Icon icon="material-symbols:share" />Invite Friends</h1>
                    <h1 className="flex gap-2 items-center"><Icon icon="ph:user-bold" />Account</h1>
                    <h1 className="flex gap-2 items-center"><Icon icon="material-symbols:help-outline" />Help</h1>
                    <h1 className="flex gap-2 items-center"><Icon icon="material-symbols:info-outline" />About</h1>
                    <h1 className="flex gap-2 items-center"><Icon icon="material-symbols:privacy-tip-outline" />Privacy & Policy </h1>
                    <h1 className="flex gap-2 items-center"><Icon icon="pajamas:remove" />
                        <AlertDialog>
                            <AlertDialogTrigger>Delete My Account</AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                        <br />
                                        This Action deletes:

                                    </AlertDialogDescription>
                                    <ol className="text-sm flex flex-col  items-start">
                                        <li>Your Profile Data Including(followers,followings)</li>
                                        <li>Your Posts and Comments</li>
                                        <li>Your media Including(Posts and Profile pictures)</li>
                                        <li>Your Notification</li>
                                    </ol>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <button onClick={() => deleteAccount()} className="w-full py-2 bg-red-500 text-slate-100 font-semibold rounded-md">Continue</button>

                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </h1>
                    <button onClick={() => logOut()} className="flex flex-row justify-center items-center rounded-sm  gap-2 px-4 py-2 bg-red-500 text-slate-50">Log Out<Icon icon="material-symbols:logout" /></button>

                </div>
            </div>
        </div>
    )
}