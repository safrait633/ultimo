import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, FilePlus, TrendingUp, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

export function QuickActions() {
  const [, setLocation] = useLocation();

  const actions = [
    {
      icon: UserPlus,
      label: "Add New Patient",
      onClick: () => setLocation("/patients"),
      color: "text-medical-blue",
      testId: "action-add-patient"
    },
    {
      icon: FilePlus,
      label: "Create Template",
      onClick: () => setLocation("/templates"),
      color: "text-medical-green",
      testId: "action-create-template"
    },
    {
      icon: TrendingUp,
      label: "View Reports",
      onClick: () => setLocation("/reports"),
      color: "text-medical-orange",
      testId: "action-view-reports"
    },
  ];

  return (
    <Card data-testid="quick-actions">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            className="w-full justify-between p-3 h-auto hover:bg-gray-50"
            onClick={action.onClick}
            data-testid={action.testId}
          >
            <span className="flex items-center">
              <action.icon className={`mr-3 h-5 w-5 ${action.color}`} />
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </span>
            <ChevronRight className="text-gray-400 h-4 w-4" />
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
