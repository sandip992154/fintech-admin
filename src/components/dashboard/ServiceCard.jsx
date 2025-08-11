// Subcomponent: Service Card
export function ServiceCard({
  icon,
  label,
  bgColor = "bg-white",
  bgIcon = "bg-white",
  name = "",
  onClick = () => {},
}) {
  return (
    <div
      name={name}
      className={`${bgColor} h-32 cursor-pointer text-black rounded-xl p-4 shadow-md flex items-center justify-center text-center`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div className={`${bgIcon} rounded-2xl p-2 mb-2`}>{icon}</div>
        <p className="text-sm  font-bold">{label}</p>
      </div>
    </div>
  );
}
