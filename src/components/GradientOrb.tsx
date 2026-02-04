export default function GradientOrb({
  className = "",
  color = "bg-vc-mint",
  size = "w-96 h-96",
  opacity = "opacity-20",
  blur = "blur-[100px]",
}: {
  className?: string;
  color?: string;
  size?: string;
  opacity?: string;
  blur?: string;
}) {
  return (
    <div
      className={`absolute pointer-events-none rounded-full ${color} ${size} ${opacity} ${blur} ${className}`}
    />
  );
}
