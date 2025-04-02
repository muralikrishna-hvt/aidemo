import { DashboardLayout } from "@/components/DashboardLayout";
import { EducationResources } from "@/components/EducationResources";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { educationalResources } from "@/lib/dummyData";
import { Button } from "@/components/ui/button";

export default function Learn() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Education</h1>
          <p className="text-gray-600 mt-1">Expand your financial knowledge with curated resources</p>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Topics</TabsTrigger>
            <TabsTrigger value="investing">Investing</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
            <TabsTrigger value="taxes">Taxes</TabsTrigger>
            <TabsTrigger value="estate">Estate Planning</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <EducationResources />
          </TabsContent>
          
          <TabsContent value="investing" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {educationalResources
                .filter(resource => resource.category === "INVESTMENT STRATEGY")
                .map((resource, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <span className="material-icons text-4xl text-gray-400">play_circle</span>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center mb-2">
                        <div className="bg-primary/10 text-primary font-medium px-2 py-1 rounded text-xs">
                          {resource.category}
                        </div>
                        <div className="ml-2 text-gray-500 text-xs">{resource.readTime}</div>
                      </div>
                      <CardTitle>{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button variant="outline" className="w-full">
                        <span className="material-icons mr-2 text-sm">play_arrow</span>
                        Start Learning
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="retirement" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {educationalResources
                .filter(resource => resource.category === "Retirement")
                .map((resource, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <span className="material-icons text-4xl text-gray-400">play_circle</span>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center mb-2">
                        <div className="bg-primary/10 text-primary font-medium px-2 py-1 rounded text-xs">
                          {resource.category}
                        </div>
                        <div className="ml-2 text-gray-500 text-xs">{resource.readTime}</div>
                      </div>
                      <CardTitle>{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button variant="outline" className="w-full">
                        <span className="material-icons mr-2 text-sm">play_arrow</span>
                        Start Learning
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="taxes" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {educationalResources
                .filter(resource => resource.category === "TAX PLANNING")
                .map((resource, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <span className="material-icons text-4xl text-gray-400">play_circle</span>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center mb-2">
                        <div className="bg-primary/10 text-primary font-medium px-2 py-1 rounded text-xs">
                          {resource.category}
                        </div>
                        <div className="ml-2 text-gray-500 text-xs">{resource.readTime}</div>
                      </div>
                      <CardTitle>{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button variant="outline" className="w-full">
                        <span className="material-icons mr-2 text-sm">play_arrow</span>
                        Start Learning
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="estate" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {educationalResources
                .filter(resource => resource.category === "Estate Planning")
                .map((resource, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <span className="material-icons text-4xl text-gray-400">play_circle</span>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center mb-2">
                        <div className="bg-primary/10 text-primary font-medium px-2 py-1 rounded text-xs">
                          {resource.category}
                        </div>
                        <div className="ml-2 text-gray-500 text-xs">{resource.readTime}</div>
                      </div>
                      <CardTitle>{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button variant="outline" className="w-full">
                        <span className="material-icons mr-2 text-sm">play_arrow</span>
                        Start Learning
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Track your financial education journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Investing Fundamentals</span>
                  <span className="text-sm text-gray-500">75% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Retirement Planning</span>
                  <span className="text-sm text-gray-500">40% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Tax Optimization</span>
                  <span className="text-sm text-gray-500">20% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Estate Planning</span>
                  <span className="text-sm text-gray-500">10% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}