interface BadgeProps {
  children: React.ReactNode;
  color: "red" | "green" | "blue" | "yellow";
}

export const Badge = (props: BadgeProps) => {
  const { children, color } = props;
  let colorClass = "",
    svgColorClass = "";
  switch (color) {
    case "red":
      colorClass = "bg-red-100 text-red-700";
      svgColorClass = "fill-red-500";
      break;
    case "green":
      colorClass = "bg-green-100 text-green-700";
      svgColorClass = "fill-green-500";
      break;
    case "blue":
      colorClass = "bg-blue-100 text-blue-700";
      svgColorClass = "fill-blue-500";
      break;
    case "yellow":
      colorClass = "bg-yellow-100 text-yellow-800";
      svgColorClass = "fill-yellow-500";
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium ${colorClass}`}
    >
      <svg
        className={`h-1.5 w-1.5 ${svgColorClass}`}
        viewBox="0 0 6 6"
        aria-hidden="true"
      >
        <circle cx={3} cy={3} r={3} />
      </svg>
      {children}
    </span>
  );
};
