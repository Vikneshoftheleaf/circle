
"use client";

import { useTheme } from "next-themes";
import { SunIcon } from '@heroicons/react/24/outline';
import { MoonIcon } from '@heroicons/react/24/solid';


const ThemeSwitcher = () => {

  const { systemTheme, theme, setTheme } = useTheme();

  const renderThemeChanger = () => {

    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      return (

        <div className="bg-neutral-800 p-2 rounded-full">
          <SunIcon className="w-6 h-6 text-yellow-500 " role="button" onClick={() =>
            setTheme('light')} />

        </div>
      )
    }

    else {
      return (
        <div className="bg-neutral-200 rounded-full p-2">
          <MoonIcon className="w-6 h-6 text-gray-900 " role="button" onClick={() =>
            setTheme('dark')} />

        </div>
      )
    }
  };

  return (
    <>
      {renderThemeChanger()}
    </>
  );
};

export default ThemeSwitcher;