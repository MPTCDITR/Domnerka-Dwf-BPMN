import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { getAvatarText } from "@/utils/avatarUtils";
import { navigationItems } from "@/constants/navigationItems";

interface HeaderProps {
  userName?: string;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<HeaderProps> = ({ userName, onSignOut }) => (
  <header className="border-b">
    <div className="w-full mx-auto px-6 py-4 max-w-8xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className=" md:hidden">
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
          <Avatar className=" border-primary border-3 h-10 w-10">
            <AvatarFallback>{getAvatarText(userName)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{userName}</span>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink href={item.href}>
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div>
          <Button onClick={onSignOut}>Log out</Button>
        </div>
      </div>
    </div>
  </header>
);

export default DashboardHeader;
