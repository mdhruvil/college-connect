"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "~/lib/constants";
import { cn } from "~/lib/utils";

export function BottomBar() {
  const pathName = usePathname();
  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-around gap-4 border-t bg-white p-4 shadow-md">
      {NAV_ITEMS.map((item) => (
        <Link key={item.label} href={item.href} className="h-full w-full">
          <div className="flex flex-col items-center gap-1">
            <item.icon
              className={cn(
                "h-6 w-6",
                pathName.startsWith(item.href) && "text-primary",
              )}
            />
            <span
              className={cn(
                "text-sm",
                pathName.startsWith(item.href) && "text-primary",
              )}
            >
              {item.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
