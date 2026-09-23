import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";

export const PRIORITY_OPTIONS = [
  { value: "high", label: "High", color: "#EF4444", level: 3 },
  { value: "medium", label: "Medium", color: "#F59E0B", level: 2 },
  { value: "low", label: "Low", color: "#64748B", level: 1 },
] as const;

export function getPriorityOption(priority: string) {
  return PRIORITY_OPTIONS.find((option) => option.value === priority) ?? PRIORITY_OPTIONS[1];
}

interface PriorityBarsProps {
  priority: string;
  color?: string;
  size?: number;
}

export default function PriorityBars({ priority, color, size = 18 }: PriorityBarsProps) {
  const option = getPriorityOption(priority);
  const activeColor = color ?? option.color;
  const barWidth = Math.max(3, Math.round(size * 0.22));

  return (
    <Box
      component="span"
      aria-hidden="true"
      sx={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: `${Math.max(1, Math.round(size * 0.1))}px`,
        flexShrink: 0,
      }}
    >
      {[0.38, 0.62, 0.86].map((height, index) => {
        const active = index < option.level;
        return (
          <Box
            component="span"
            key={height}
            sx={{
              width: barWidth,
              height: Math.round(size * height),
              borderRadius: `${Math.max(1, Math.round(barWidth * 0.45))}px`,
              bgcolor: active ? activeColor : alpha(activeColor, 0.18),
              boxShadow: active ? `inset 0 -1px 0 ${alpha("#000000", 0.08)}` : "none",
            }}
          />
        );
      })}
    </Box>
  );
}
