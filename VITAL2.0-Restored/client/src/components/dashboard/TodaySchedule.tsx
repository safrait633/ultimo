import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Consultation } from "@shared/schema";

export function TodaySchedule() {
  const { data: consultations = [], isLoading } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations"],
  });

  const today = new Date();
  const todayConsultations = consultations.filter(consultation => {
    const consultationDate = new Date(consultation.scheduledAt);
    return consultationDate.toDateString() === today.toDateString();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-medical-green";
      case "in_progress":
        return "bg-medical-blue";
      case "scheduled":
        return "bg-medical-orange";
      default:
        return "bg-gray-400";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="today-schedule">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
      </CardHeader>
      <CardContent>
        {todayConsultations.length === 0 ? (
          <div className="text-center py-4 text-gray-500" data-testid="no-schedule">
            No appointments scheduled for today
          </div>
        ) : (
          <div className="space-y-4">
            {todayConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center space-x-3"
                data-testid={`schedule-item-${consultation.id}`}
              >
                <div className={`w-2 h-2 rounded-full ${getStatusColor(consultation.status)}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900" data-testid={`schedule-time-${consultation.id}`}>
                    {new Date(consultation.scheduledAt).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                  <p className="text-xs text-gray-500" data-testid={`schedule-details-${consultation.id}`}>
                    {consultation.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
