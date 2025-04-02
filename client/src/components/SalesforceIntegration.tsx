import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { clientInteractions, tasksAndReminders } from "@/lib/dummyData";

export function SalesforceIntegration() {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="p-5 pb-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="material-icons text-primary mr-2">integration_instructions</span>
            <CardTitle className="text-lg font-semibold">Salesforce Integration</CardTitle>
          </div>
          <Button variant="link" className="text-primary text-sm font-medium p-0 flex items-center">
            <span className="material-icons text-sm mr-1">open_in_new</span>
            Open in Salesforce
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="bg-gray-50 rounded-lg p-4 mb-5">
          <h3 className="font-medium text-gray-700 mb-3">Recent Client Interactions</h3>
          <div className="space-y-3">
            {clientInteractions.map((interaction) => (
              <div key={interaction.id} className="flex items-start space-x-3 pb-3 border-b border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white flex-shrink-0">
                  <span className="material-icons text-sm">{interaction.icon}</span>
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-800">{interaction.title}</h4>
                    <span className="text-xs text-gray-500 ml-2">{interaction.timeAgo}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{interaction.description}</p>
                  <div className="mt-2">
                    <Button variant="link" className="text-primary text-xs font-medium p-0">
                      {interaction.actionText}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Upcoming Tasks & Reminders</h3>
          <div className="space-y-3">
            {tasksAndReminders.map((task) => (
              <div key={task.id} className="flex items-center space-x-3">
                <Checkbox id={`task-${task.id}`} className="w-5 h-5 border border-gray-300 rounded flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-700">{task.title}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span className="material-icons text-xs mr-1">schedule</span>
                    <span>{task.dueText}</span>
                    <span className="mx-2">•</span>
                    <span className={task.priorityColor}>{task.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
