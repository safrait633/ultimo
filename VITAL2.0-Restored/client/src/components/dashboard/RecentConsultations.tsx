import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Consultation } from "@shared/schema";

export function RecentConsultations() {
  const { data: consultations = [], isLoading } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations"],
  });

  const recentConsultations = consultations.slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-medical-green-light text-medical-green";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "scheduled":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Recent Consultations</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="recent-consultations">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Consultations</h3>
          <Button variant="ghost" size="sm" className="text-medical-blue hover:text-blue-700" data-testid="view-all-consultations">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentConsultations.length === 0 ? (
          <div className="text-center py-8 text-gray-500" data-testid="no-consultations">
            No consultations found
          </div>
        ) : (
          <div className="space-y-4">
            {recentConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                data-testid={`consultation-${consultation.id}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {consultation.patientId.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900" data-testid={`consultation-type-${consultation.id}`}>
                      {consultation.type}
                    </p>
                    <p className="text-sm text-gray-500" data-testid={`consultation-time-${consultation.id}`}>
                      {new Date(consultation.scheduledAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(consultation.status)}`}
                    data-testid={`consultation-status-${consultation.id}`}
                  >
                    {consultation.status.replace("_", " ")}
                  </span>
                  <ChevronRight className="text-gray-400 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
