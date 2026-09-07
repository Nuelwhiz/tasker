import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface TaskerLogoProps {
  href?: string;
  showText?: boolean;
  light?: boolean;
}

export function TaskerLogo({
  href = "/",
  showText = true,
  light = false,
}: TaskerLogoProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-2">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          light
            ? "bg-white text-primary"
            : "bg-primary text-primary-foreground"
        }`}
      >
        <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
      </div>

      {showText && (
        <span
          className={`text-2xl font-bold tracking-tight ${
            light ? "text-white" : "text-foreground"
          }`}
        >
          Tasker
        </span>
      )}
    </Link>
  );
}