import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import { navigationItems } from "@/constants/navigationItems";
interface NavigationItems {
  href: string;
  icon?: React.ElementType;
  label: string;
}

const SidebarMenuItemComponent = ({ href, label }: NavigationItems) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild>
      <a href={href}>
        <span>{label}</span>
      </a>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((link, index) => (
                <SidebarMenuItemComponent key={index} {...link} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
