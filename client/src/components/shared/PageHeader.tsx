import { cn } from "@/lib/utils";
import React from "react";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 pb-4 md:pb-6 border-b",
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex items-center space-x-2">{children}</div>}
    </div>
  );
};