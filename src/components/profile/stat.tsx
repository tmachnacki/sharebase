import { cn } from "@/lib/utils";

const Stat = ({ number, label, className }: { number: number; label: string, className?: string; }) => {
  return (
    <div className={cn(
        "flex flex-col items-center justify-center gap-1",
        className
      )}
    >
      <span className="font-semibold text-lg leading-none">{number}</span>
      <span className="font-thin leading-none text-slate-600 dark:text-slate-400">{label}</span>
    </div>
  )
}

export { Stat }