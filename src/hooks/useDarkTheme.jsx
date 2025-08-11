import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

// Custom hook for easy usage
export const useDarkTheme = () => useContext(ThemeContext);
