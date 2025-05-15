export default function PathPlanningGrid({
  children,
  grid,
}: {
  children?: React.ReactNode;
  grid?: boolean;
}) {
  return (
    <svg className="w-full h-full" viewBox="0 0 256 256">
      {grid &&
        [...Array(15)].map((_, i) => (
          <path
            key={i}
            d={`M${(i + 1) * 16} 0 L${(i + 1) * 16} 256`}
            stroke="lightgray"
            strokeWidth={0.5}
          />
        ))}

      {grid &&
        [...Array(15)].map((_, i) => (
          <path
            key={i}
            d={`M0 ${(i + 1) * 16} L256 ${(i + 1) * 16}`}
            stroke="lightgray"
            strokeWidth={0.5}
          />
        ))}

      {children}
    </svg>
  );
}
