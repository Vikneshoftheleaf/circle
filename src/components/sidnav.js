'use client';

import React from 'react';
import { useAuthContext } from '@/context/authcontext';
import Link from 'next/link';

import useNavigation from '@/hooks/use-navigation';
import { Icon } from '@iconify/react';

const SideNav = () => {
  const {
    isHomeActive,
    isExploreActive,
    isNotificationsActive,
    isProfileActive,
  } = useNavigation();

  const {user} = useAuthContext();
  if(user)
  return (
    <div className="lg:flex sm:hidden flex-col space-y-4 items-center py-8 hidden border-r border-zinc-700 h-full  w-[120px] md:w-[250px] md:items-start fixed">
      <Link
        href="/"
        className="flex flex-row space-x-1 items-center hover:bg-white/10 p-4 rounded-full duration-200"
      >
        <Icon icon="bi:twitter-x" width="38" height="38" />
      </Link>

      <Link
        href="/account/vids"
        className="flex flex-row space-x-4 items-center px-4 py-3 rounded-full duration-200 hover:bg-white/10 relative"
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
          <Icon icon="ph:plus-fill" width={32} height={32} />) : (
          <Icon icon="ph:plus-fill" width={32} height={32} />)
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

{isNotificationsActive ? (
              <Icon icon="mingcute:notification-fill" height={32} width={32} />) : (
                <Icon icon="mingcute:notification-line" height={32} width={32} />)
              }

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
            ?<Icon icon="ph:user-bold" height={32} width={32} />
            :<Icon icon="ph:user" height={32} width={32} />
          }
        <span
          className={`text-2xl pt-2 hidden md:flex ${isProfileActive ? 'font-bold' : ''
            }`}
        >
          Profile
        </span>
      </Link>
    </div>
  );
          
};

export default SideNav;