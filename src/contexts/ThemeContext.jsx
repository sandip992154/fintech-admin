import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isSuperDarkMode, setIsSuperDarkMode] = useState(() => {
    return localStorage.getItem("theme-super") === "dark";
  });

  const [isAdminDarkMode, setIsAdminDarkMode] = useState(() => {
    return localStorage.getItem("theme-admin") === "dark";
  });

  // Control <html> class globally (optional: prioritize Super Admin)
  useEffect(() => {
    const html = document.documentElement;

    if (isSuperDarkMode || isAdminDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isSuperDarkMode, isAdminDarkMode]);

  // Toggle functions
  const toggleSuperTheme = () => {
    const newTheme = !isSuperDarkMode;
    setIsSuperDarkMode(newTheme);
    localStorage.setItem("theme-super", newTheme ? "dark" : "light");
  };

  const toggleAdminTheme = () => {
    const newTheme = !isAdminDarkMode;
    setIsAdminDarkMode(newTheme);
    localStorage.setItem("theme-admin", newTheme ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider
      value={{
        isSuperDarkMode,
        isAdminDarkMode,
        toggleSuperTheme,
        toggleAdminTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
