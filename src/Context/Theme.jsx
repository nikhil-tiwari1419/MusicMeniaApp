// import { createContext, useContext, useEffect, useState } from "react";

// const ThemeContext = createContext(null);

// export const useTheme = () => useContext(ThemeContext);

// export const ThemeProvider = ({ children }) => {

//    const [theme, setIsDarkMode] = useState(() => {
//       const savedTheme = localStorage.getItem("theme");
//       return savedTheme === "dark";
//    });

//    // 👇 IMPORTANT FIX
//    useEffect(() => {
//       if (theme) {
//          document.documentElement.classList.add("dark");
//          localStorage.setItem("theme", "dark");
//       } else {
//          document.documentElement.classList.remove("dark");
//          localStorage.setItem("theme", "light");
//       }
//    }, [theme]);

//    const toggleTheme = () => {
//       setIsDarkMode(prev => !prev);
//    };

//    return (
//       <ThemeContext.Provider value={{ theme, toggleTheme }}>
//          {children}
//       </ThemeContext.Provider>
//    );
// };

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {

   const [theme, setTheme] = useState(() => {
      return localStorage.getItem("theme") || "light"; // ✅ string return karo
   });

   useEffect(() => {
      if (theme === "dark") {
         document.documentElement.classList.add("dark");
         localStorage.setItem("theme", "dark");
      } else {
         document.documentElement.classList.remove("dark");
         localStorage.setItem("theme", "light");
      }
   }, [theme]);

   const toggleTheme = () => {
      setTheme(prev => prev === "dark" ? "light" : "dark"); // ✅ string toggle
   };

   return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
         {children}
      </ThemeContext.Provider>
   );
};