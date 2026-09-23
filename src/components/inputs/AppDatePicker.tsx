"use client";

import { useState } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { SxProps, Theme } from "@mui/material/styles";

interface AppDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  fullWidth?: boolean;
  compact?: boolean;
  compactSize?: number;
  sx?: SxProps<Theme>;
}

export default function AppDatePicker({
  value,
  onChange,
  label,
  fullWidth = false,
  compact = false,
  compactSize = 36,
  sx,
}: AppDatePickerProps) {
  const [open, setOpen] = useState(false);
  const pickerValue = value ? dayjs(value.slice(0, 10)) : null;

  const picker = (
    <DatePicker
      label={label}
      value={pickerValue}
      onChange={(nextValue) => {
        onChange(nextValue?.isValid() ? nextValue.format("YYYY-MM-DD") : "");
      }}
      format="DD/MM/YYYY"
      open={compact ? open : undefined}
      onOpen={compact ? () => setOpen(true) : undefined}
      onClose={compact ? () => setOpen(false) : undefined}
      slotProps={{
        field: { clearable: true },
        textField: compact
          ? {
              onClick: () => setOpen(true),
              sx: {
                position: "absolute",
                inset: 0,
                width: compactSize,
                height: compactSize,
                opacity: 0,
                zIndex: 1,
                cursor: "pointer",
              },
            }
          : {
              fullWidth,
              size: "small",
              sx: {
                ...sx,
                "& .MuiPickersInputBase-root": {
                  borderRadius: "10px",
                  minHeight: 44,
                },
              },
            },
      }}
    />
  );

  if (!compact) return picker;

  return (
    <Box
      sx={{
        position: "relative",
        width: compactSize,
        height: compactSize,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        ...sx,
      }}
    >
      <CalendarTodayOutlinedIcon sx={{ fontSize: Math.round(compactSize * 0.46) }} />
      {picker}
    </Box>
  );
}
