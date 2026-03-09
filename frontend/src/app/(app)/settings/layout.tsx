import type { ReactNode } from "react";

import { SettingsShell } from "@/features/settings/components/SettingsShell";

export default function Layout({ children }: { children: ReactNode }) {
  return <SettingsShell>{children}</SettingsShell>;
}
