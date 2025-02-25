import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "react-oidc-context";
import Header from "./Navbar";
import { decodeUserToken } from "@/utils/keycloak/KeyCloakUtil";
import { DashboardSidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  const auth = useAuth();
  const user = decodeUserToken(auth.user);
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1">
          <Header
            userName={user?.name}
            onSignOut={() => auth.signoutRedirect()}
          />
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
