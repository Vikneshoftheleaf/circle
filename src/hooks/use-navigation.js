'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

const useNavigation = () => {
  const pathname = usePathname();
  const [isHomeActive, setIsHomeActive] = useState(false);
  const [isExploreActive, setIsExploreActive] = useState(false);
  const [isNotificationsActive, setIsNotificationsActive] = useState(false);
  const [isProfileActive, setIsProfileActive] = useState(false);

  useEffect(() => {
    setIsHomeActive(false);
    setIsExploreActive(false);
    setIsNotificationsActive(false);
    setIsProfileActive(false);

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
  };
};

export default useNavigation;