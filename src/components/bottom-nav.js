'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { doc, query, collection, onSnapshot, where, QuerySnapshot } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import useNavigation from '@/hooks/use-navigation';
import useScrollingEffect from '@/hooks/usescroll';
import { Icon } from '@iconify/react';
import { useAuthContext } from '@/context/authcontext';
const BottomNav = () => {
  const scrollDirection = useScrollingEffect(); // Use the custom hook
  const navClass = null;//scrollDirection === 'up' ? 'opacity-100 duration-500' : 'opacity-25 duration-500';
  const { user } = useAuthContext();
  const { profile } = useAuthContext();

  const [ncount, setncount] = useState(null)
  const {
    isHomeActive,
    isExploreActive,
    isProfileActive,
    isNotificationsActive
  } = useNavigation();

  useEffect(() => {
    if (user != null) {

      const cref = collection(db, 'notifications')
      const q = query(cref, where('notificationTo', '==', user.uid), where('read', '==', false));
      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
        setncount(QuerySnapshot.size)
      })

      return unsubscribe;


    }


  }, [user])

  useEffect(() => {
    if (ncount != null) {
      console.log(ncount)
    }
  }, [ncount])

  if (user!=null && profile != null && profile.userName != null) {
    return (
      <div className={`fixed bottom-0 w-full py-4 z-10 bg-white dark:bg-zinc-950 border-t dark:border-zinc-800 border-zinc-200 shadow-lg sm:hidden ${navClass}`}>
        <div className="flex flex-row justify-around items-center w-full">
          <Link href="/account/vids" className="flex items-center relative">
            {isHomeActive ? (
              <Icon icon="mingcute:home-5-fill" width="32" height="32" />
            ) : (
              <Icon icon="mingcute:home-5-line" width="32" height="32" />
            )}
            {/* <span className="h-2 w-2 rounded-full bg-sky-500 absolute -top-0.5 right-[3px]"></span> */}
          </Link>
          <Link href="/account/search" className="flex items-center">
            {isExploreActive ? (
              <Icon
                icon="uil:search"
                width="32"
                height="32"
                className="stroke-current stroke-5"
              />
            ) : (
              <Icon icon="uil:search" width="32" height="32" />
            )}
          </Link>
          <Link href="/account/uploads" className="flex items-center">
            {isNotificationsActive ? (
              <Icon icon="basil:add-outline" width={32} height={32} />) : (
              <Icon icon="basil:add-outline" width={32} height={32} />)
            }
          </Link>

          <Link href="/account/notification" className="flex items-center relative">
            <div>{(ncount != null) ? (ncount > 0)
              ? <div className='absolute h-2 w-2 bg-red-500 rounded-full top-0 right-0 text-xs text-slate-100'></div>
              : null : null}
            </div>
            {isNotificationsActive ? (
              <Icon icon="mingcute:notification-fill" height={32} width={32} />) : (
              <Icon icon="mingcute:notification-line" height={32} width={32} />)
            }
          </Link>

          <Link href="/account/profile" className="flex items-center">
            {isProfileActive
              ? <Icon icon="ph:user-bold" height={32} width={32} />
              : <Icon icon="ph:user" height={32} width={32} />
            }
          </Link>
        </div>
      </div>
    );
  }

};

export default BottomNav;