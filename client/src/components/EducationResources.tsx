import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { educationalResources } from "@/lib/dummyData";

export function EducationResources() {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="p-5 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Financial Education</CardTitle>
          <Button variant="link" className="text-primary text-sm font-medium p-0">
            View All Resources
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {educationalResources.map((resource) => (
            <div key={resource.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-200 relative">
                <img src={resource.imageUrl} alt={resource.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium text-gray-700">
                  {resource.readTime}
                </div>
              </div>
              <div className="p-4">
                <span className="text-xs text-primary font-medium">{resource.category}</span>
                <h3 className="font-medium text-gray-800 mt-1">{resource.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{resource.description}</p>
                <Button variant="link" className="text-primary text-sm font-medium mt-3 p-0 flex items-center">
                  {resource.actionText}
                  <span className="material-icons text-sm ml-1">{resource.actionIcon}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
