"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

export function SidebarActiveLink() {
  const pathname = usePathname();
  return <Sidebar activeHref={pathname} />;
}
