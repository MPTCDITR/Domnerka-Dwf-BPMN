import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";

import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import BpmnEditor from "@/pages/BpmnModeler/BpmnEditor";
import AuthLayout from "@/layouts/layout";
import NotFound from "@/pages/PageNotFound";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";

import { userManager, onSigninCallback } from "@/lib/Keycloak";

function App() {
  return (
    <AuthProvider userManager={userManager} onSigninCallback={onSigninCallback}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AuthLayout />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard/overview" element={<Dashboard />} />
              <Route path="/process/bpmn-editor" element={<BpmnEditor />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
