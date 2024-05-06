"use client";

import logo from "@/assets/images/logo.png";
import {
  BellIcon,
  CalendarPlus2,
  HomeIcon,
  Newspaper,
  Rss,
  UsersRound,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { usePathname } from "next/navigation";

// all the sidebar links are defined here
const SIDEBAR_LINK = [
  {
    icon: HomeIcon,
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: Newspaper,
    label: "News/Notices",
    href: "/admin/notices",
  },
  {
    icon: CalendarPlus2,
    label: "Events",
    href: "/admin/events",
  },
  {
    icon: Rss,
    label: "Blogs",
    href: "/admin/blogs",
  },
  {
    icon: UsersRound,
    label: "Committee",
    href: "/admin/committee",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/admin">
            <Image
              src={logo}
              className="h-9 w-9 object-contain origin-center"
              height={100}
              width={100}
              alt="ACES"
            />
            <span className="">ACES</span>
          </Link>
          <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
            <BellIcon className="h-6 w-6" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-3">
            {SIDEBAR_LINK.map((link, index) => (
              <Link
                key={index}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                href={link.href}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            className="w-full flex items-center gap-3"
            variant="secondary"
          >
            <span>Trigger</span>
            <Zap className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
