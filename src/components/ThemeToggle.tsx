"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themeOptions = [
  { value: "light", label: "Sáng", icon: Sun },
  { value: "dark", label: "Tối", icon: Moon },
  { value: "system", label: "Theo hệ thống", icon: Monitor },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const activeTheme = theme || "system";
  const ActiveIcon = themeOptions.find((option) => option.value === activeTheme)?.icon || Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-2"
          title="Đổi giao diện"
          aria-label="Đổi giao diện"
        >
          <ActiveIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isActive = activeTheme === option.value;

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className="cursor-pointer justify-between px-2 py-2"
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {option.label}
              </span>
              {isActive && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
