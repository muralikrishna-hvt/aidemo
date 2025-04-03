import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema } from "@shared/schema";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "test1@gmail.com",
      password: "test1@gmail.com",
    },
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      email: "",
    },
  });

  // Redirect if already logged in - moved after all hooks
  if (user) {
    navigate("/dashboard");
    return null;
  }
  
  function onLoginSubmit(data: LoginFormValues) {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/dashboard");
      }
    });
  }
  
  function onRegisterSubmit(data: RegisterFormValues) {
    // Remove confirmPassword as it's not part of the API schema
    const { confirmPassword, ...registerData } = data;
    
    registerMutation.mutate(registerData, {
      onSuccess: () => {
        navigate("/dashboard");
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left side: Auth form */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-2">
              <span className="material-icons text-4xl text-primary">account_balance</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">WealthAdvisor AI</h1>
            <p className="text-gray-600 mt-2">AI-Powered Financial Insights Platform</p>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <Tabs defaultValue="login" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent className="pt-4">
              {activeTab === "login" ? (
                <Form {...loginForm}>
                  <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
                    <p className="font-medium">Demo Account:</p>
                    <p>Username: test1@gmail.com</p>
                    <p>Password: test1@gmail.com</p>
                  </div>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your username" 
                              {...field} 
                              autoComplete="username"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your password" 
                              {...field} 
                              autoComplete="current-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full mt-4" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name" 
                              {...field} 
                              autoComplete="name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your email" 
                              type="email"
                              {...field} 
                              autoComplete="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Choose a username" 
                              {...field} 
                              autoComplete="username"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Choose a strong password" 
                              {...field} 
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Confirm your password" 
                              {...field} 
                              autoComplete="new-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full mt-4" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right side: Hero Content */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Personal AI <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Financial Advisor</span>
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              WealthAdvisor AI leverages cutting-edge artificial intelligence to provide personalized financial insights, real-time market analysis, and investment opportunities tailored to your goals.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <span className="material-icons text-primary">psychology</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">AI-Powered Insights</h3>
                  <p className="text-gray-600">Gemini with Model Context Protocol (MCP) delivers personalized financial recommendations based on your unique situation.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-emerald-100 rounded-full p-2 mt-1">
                  <span className="material-icons text-emerald-600">auto_graph</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Portfolio Analysis</h3>
                  <p className="text-gray-600">Get real-time analysis of your investments, asset allocation, and optimization opportunities.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-amber-100 rounded-full p-2 mt-1">
                  <span className="material-icons text-amber-600">savings</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Goal Tracking</h3>
                  <p className="text-gray-600">Set financial goals and track your progress with AI-assisted recommendations to reach them faster.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}