// import React, { useEffect, useState } from 'react';

// const ThemeToggle = () => {
//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     const stored = localStorage.getItem('theme');
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

//     if (stored === 'dark' || (!stored && prefersDark)) {
//       document.documentElement.classList.add('dark');
//       setIsDark(true);
//     } else {
//       document.documentElement.classList.remove('dark');
//       setIsDark(false);
//     }
//   }, []);

//   const toggleTheme = () => {
//     const updated = !isDark;
//     setIsDark(updated);
//     if (updated) {
//       document.documentElement.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   };

//   return (
//     <button
//       onClick={toggleTheme}
//       className="mb-4 px-4 py-2 bg-secondary text-white rounded hover:bg-violet-600 transition"
//     >
//       {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
//     </button>
//   );
// };

// export default ThemeToggle;
