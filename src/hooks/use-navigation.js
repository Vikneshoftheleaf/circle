'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

const useNavigation = () => {
  const pathname = usePathname();
  const [isHomeActive, setIsHomeActive] = useState(false);
  const [isExploreActive, setIsExploreActive] = useState(false);
  const [isNotificationsActive, setIsNotificationsActive] = useState(false);
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [isMessageActive, setIsmessageactive] = useState(false)

  useEffect(() => {
    setIsHomeActive(false);
    setIsExploreActive(false);
    setIsNotificationsActive(false);
    setIsProfileActive(false);
    setIsmessageactive(false)

    switch (pathname) {
      case '/account/vids':
        setIsHomeActive(true);
        break;
      case '/account/search':
        setIsExploreActive(true);
        break;
      case '/account/notification':
        setIsNotificationsActive(true);
        break;
      case '/account/profile':
        setIsProfileActive(true);
        break;
      case '/account/message':
        setIsmessageactive(true);
        break;
        
      default:
        // Handle any other cases here
        break;
    }
  }, [pathname]);

  return {
    isHomeActive,
    isExploreActive,
    isNotificationsActive,
    isProfileActive,
    isMessageActive
  };
};

export default useNavigation;