import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";

import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import BpmnEditor from "@/pages/BpmnModeler/BpmnEditor";
import AuthLayout from "@/layouts/layout";
import NotFound from "@/pages/PageNotFound";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";

import { userManager, onSigninCallback } from "@/lib/Keycloak";
import CreateProcess from "./pages/CreateProcess/CreateProcess";
import ProcessList from "./pages/ProcessList/ProcessList";

function App() {
  return (
    <AuthProvider userManager={userManager} onSigninCallback={onSigninCallback}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AuthLayout />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard/overview" element={<Dashboard />} />
              <Route path="/process/process_list" element={<ProcessList />} />
              <Route
                path="/process/create_process"
                element={<CreateProcess />}
              />
              <Route path="/process/:id" element={<BpmnEditor />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
