import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpenCheck,
  Camera,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileBarChart,
  FileCheck2,
  GitCompareArrows,
  Grid2X2,
  History,
  Menu,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

export interface IconProps {
  readonly name: string;
  readonly size?: number;
}

export function Icon({ name, size = 17 }: IconProps) {
  const props = { size, strokeWidth: 1.8 };
  const icons: Record<string, ReactNode> = {
    alert: <AlertTriangle {...props} />,
    bar: <BarChart3 {...props} />,
    bell: <Bell {...props} />,
    camera: <Camera {...props} />,
    check: <CheckCircle2 {...props} />,
    chevron: <ChevronRight {...props} />,
    clipboard: <ClipboardCheck {...props} />,
    compare: <GitCompareArrows {...props} />,
    file: <FileCheck2 {...props} />,
    grid: <Grid2X2 {...props} />,
    history: <History {...props} />,
    menu: <Menu {...props} />,
    report: <FileBarChart {...props} />,
    review: <UsersRound {...props} />,
    rules: <BookOpenCheck {...props} />,
    search: <Search {...props} />,
    settings: <Settings2 {...props} />,
    shield: <ShieldCheck {...props} />,
    sparkles: <Sparkles {...props} />,
    user: <UserRound {...props} />,
    x: <X {...props} />,
  };
  return icons[name] ?? <Sparkles {...props} />;
}
