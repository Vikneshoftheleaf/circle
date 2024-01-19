'use client';

import React from 'react';
import { useAuthContext } from '@/context/authcontext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { doc, query, collection, onSnapshot, where, QuerySnapshot } from 'firebase/firestore';
import useNavigation from '@/hooks/use-navigation';
import { Icon } from '@iconify/react';

const SideNav = () => {
  const {
    isHomeActive,
    isExploreActive,
    isNotificationsActive,
    isProfileActive,
    isMessageActive
  } = useNavigation();

  const { user } = useAuthContext();
  const [ncount, setncount] = useState(null)

  const { profile } = useAuthContext();
  const [loading, setloading] = useState(true);
  const [totalUnreadMessage, settotalUnreadMessage] = useState()

  useEffect(() => {
    if(profile != null)
    {
      const cref = collection(db, 'chats')

      const q = query(cref, where("read", '==', false), where('to', '==', profile.uid));
      const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
          settotalUnreadMessage(QuerySnapshot.size)
      })
  
        return unsubscribe;
    }

  }, [profile])


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
  if (user != null)
    return (
      <div className="lg:flex sm:hidden flex-col space-y-4 items-center py-8 hidden border-r border-zinc-700 h-full  w-[120px] md:w-[250px] md:items-start relative">

        <div className='fixed h-full '>

          <Link
            href="/account/vids"
            className="flex flex-row space-x-4 items-center px-4 py-3 rounded-full duration-200 hover:bg-white/10 relative w-full"
          >
            {isHomeActive ? (
              <Icon icon="mingcute:home-5-fill" width="32" height="32" />
            ) : (
              <Icon icon="mingcute:home-5-line" width="32" height="32" />
            )}
            <span
              className={`text-2xl pt-2 hidden md:flex ${isHomeActive ? 'font-bold' : ''
                }`}
            >
              Home
            </span>
            {/* <span className='h-2 w-2 rounded-full bg-sky-500 absolute top-3 right-[16px] md:right-[100px]'></span> */}
          </Link>
          <Link
            href="/account/search"
            className="flex flex-row space-x-4 items-center px-4 py-3 rounded-full duration-200 hover:bg-white/10"
          >
            {isExploreActive ? (
              <Icon
                icon="uil:search"
                width="38"
                height="38"
                className="stroke-current stroke-5"
              />
            ) : (
              <Icon icon="uil:search" width="38" height="38" />
            )}
            <span
              className={`text-2xl pt-2 hidden md:flex ${isExploreActive ? 'font-bold' : ''
                }`}
            >
              Explore
            </span>
          </Link>
          <Link
            href="/account/uploads"
            className="flex flex-row space-x-4 items-center px-4 py-3 rounded-full duration-200 hover:bg-white/10"
          >

            {isNotificationsActive ? (
              <Icon icon="basil:add-outline" width={32} height={32} />) : (
              <Icon icon="basil:add-outline" width={32} height={32} />)
            }

            <span
              className={`text-2xl pt-2 hidden md:flex ${isNotificationsActive ? 'font-bold' : ''
                }`}
            >
              Upload
            </span>
          </Link>

          <Link
            href="/account/notification"
            className="flex flex-row space-x-4 items-center px-4 py-3 rounded-full duration-200 hover:bg-white/10"
          >
            <div className='relative'>
              <div>{(ncount != null) ? (ncount > 0)
                ? <div className='absolute h-2 w-2 bg-red-500 rounded-full top-0 right-0 text-xs text-slate-100'></div>
                : null : null}
              </div>
              {isNotificationsActive ? (
                <Icon icon="mingcute:notification-fill" height={32} width={32} />) : (
                <Icon icon="mingcute:notification-line" height={32} width={32} />)
              }

            </div>


            <span
              className={`text-2xl pt-2 hidden md:flex ${isNotificationsActive ? 'font-bold' : ''
                }`}
            >
              Notifications
            </span>
          </Link>



          <Link
            href="/account/profile"
            className="flex flex-row space-x-4 items-center px-4 py-3 rounded-full duration-200 hover:bg-white/10"
          >
            {isProfileActive
              ? <Icon icon="ph:user-bold" height={32} width={32} />
              : <Icon icon="ph:user" height={32} width={32} />
            }
            <span
              className={`text-2xl pt-2 hidden md:flex ${isProfileActive ? 'font-bold' : ''
                }`}
            >
              Profile
            </span>
          </Link>

          <Link
            href="/account/message"
            className="flex flex-row space-x-4 items-center px-4 py-3 rounded-full duration-200 hover:bg-white/10"
          >
            <div className='relative'>
              <div>{(totalUnreadMessage != null && totalUnreadMessage > 0)
                ? <div className='absolute h-2 w-2 bg-red-500 rounded-full top-0 right-0 flex items-center justify-center text-xs p-[8px] text-slate-100'>{totalUnreadMessage}</div>
                : null }
              </div>
              {isMessageActive ? (
                <Icon icon="mingcute:message-3-fill" height={32} width={32} />) : (
                <Icon icon="mingcute:message-3-line" height={32} width={32} />)
              }

            </div>


            <span
              className={`text-2xl pt-2 hidden md:flex ${isMessageActive ? 'font-bold' : ''
                }`}
            >
              Messages
            </span>
          </Link>
        </div>
      </div>
    );

};

export default SideNav;