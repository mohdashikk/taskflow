"use client";

import Button from "@mui/material/Button";
import { useAppDispatch } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/themeSlice";

export default function HomePage() {
  const dispatch = useAppDispatch();

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-5">
        TaskFlow
      </h1>

      <Button
        variant="contained"
        onClick={() => dispatch(toggleTheme())}
      >
        Toggle Theme
      </Button>
    </main>
  );
}