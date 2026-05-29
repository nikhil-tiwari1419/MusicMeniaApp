import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const THEME_KEY = "theme";

export const useTheme = () => useContext(ThemeContext);

function getStoredTheme() {
   try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
   } catch (error) {
      console.error("Failed to read theme from localStorage:", error);
      return "light";
   }
}

function saveTheme(theme) {
   try {
      localStorage.setItem(THEME_KEY, theme);
   } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
   }
}

export const ThemeProvider = ({ children }) => {

   const [theme, setTheme] = useState(getStoredTheme);

   useEffect(() => {
      if (theme === "dark") {
         document.documentElement.classList.add("dark");
         saveTheme("dark");
      } else {
         document.documentElement.classList.remove("dark");
         saveTheme("light");
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


