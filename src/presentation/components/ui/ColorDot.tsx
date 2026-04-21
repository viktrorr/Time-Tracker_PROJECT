type ColorDotProps = {
  colorHex?: string | null;
  className?: string;
};

export function ColorDot({ colorHex, className = "h-2.5 w-2.5" }: ColorDotProps): JSX.Element {
  return (
    <span
      className={`inline-flex rounded-full ${className}`}
      style={{ backgroundColor: colorHex ?? "#CBD5E1" }}
    />
  );
}
