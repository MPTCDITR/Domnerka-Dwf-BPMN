import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Home, Users, ShoppingCart, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
// import { Link } from "react-router-dom";

const Dashboard = () => {
  const { userProfile, logout } = useAuth();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  Domnerka
                </h2>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/dashboard" className="flex items-center">
                        <Home className="mr-2 h-4 w-4" />
                        <span>Overview</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/#" className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Processes Overview</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/#" className="flex items-center">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>Forms Overview</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="border-b">
            <div className="w-full mx-auto px-6 py-4 max-w-8xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger>
                    <Menu className="h-6 w-6" />
                  </SidebarTrigger>
                  <Avatar className="h-8 w-8" />
                  <span className="font-medium">{userProfile?.username}</span>
                  <nav className="hidden md:block ml-8">
                    <ul className="flex space-x-6">
                      <li>
                        <a href="#" className="text-gray-900">
                          Overview
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          BPMN Process
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          Form BPMN
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          Settings
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div className="flex items-center space-x-4">
                  <Button onClick={logout}>Log out</Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-8xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Total Process</p>
                  <h3 className="text-2xl font-bold">45</h3>
                  <p className="text-sm text-green-500">
                    BPMN Process Overview
                  </p>
                </div>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Active Process</p>
                  <h3 className="text-2xl font-bold">23</h3>
                  <p className="text-sm text-green-500">
                    BPMN Process Overview
                  </p>
                </div>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Total Form</p>
                  <h3 className="text-2xl font-bold">12</h3>
                  <p className="text-sm text-green-500">
                    BPMN Process Overview
                  </p>
                </div>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Total Running Process</p>
                  <h3 className="text-2xl font-bold">23</h3>
                  <p className="text-sm text-green-500">
                    BPMN Process Overview
                  </p>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
