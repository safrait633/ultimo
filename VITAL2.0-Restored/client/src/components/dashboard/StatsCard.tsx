import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  testId?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "positive",
  icon: Icon,
  iconBgColor,
  iconColor,
  testId
}: StatsCardProps) {
  return (
    <Card className="border border-gray-200" data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600" data-testid={`${testId}-title`}>{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2" data-testid={`${testId}-value`}>{value}</p>
            {change && (
              <p className={cn(
                "text-sm mt-1 flex items-center",
                changeType === "positive" && "text-medical-green",
                changeType === "negative" && "text-red-500",
                changeType === "neutral" && "text-medical-orange"
              )} data-testid={`${testId}-change`}>
                {changeType === "positive" && "↗"}
                {changeType === "negative" && "↘"}
                {changeType === "neutral" && "⏰"}
                <span className="ml-1">{change}</span>
              </p>
            )}
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconBgColor)}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
