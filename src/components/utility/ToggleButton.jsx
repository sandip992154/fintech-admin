export const ToggleButton = ({ row, onchange = () => {} }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={row?.status}
        onChange={onchange}
        className="sr-only peer"
      />
      <div
        className="w-11 h-5 border-2 border-slate-500 rounded-full transition-all duration-300 
    peer-checked:bg-secondary relative
    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
    after:bg-slate-400 after:rounded-full after:h-3 after:w-3 
    after:transition-all peer-checked:after:translate-x-[20px] peer-checked:after:bg-white"
      ></div>
    </label>
  );
};
