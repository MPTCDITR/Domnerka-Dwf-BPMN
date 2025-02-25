import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";

import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";
import BpmnEditor from "@/pages/BpmnModeler/BpmnEditor";
import AuthLayout from "@/layouts/layout";
import NotFound from "@/pages/PageNotFound";

import { userManager, onSigninCallback } from "@/lib/Keycloak";
import CreateProcess from "./pages/CreateProcess/CreateProcess";

function App() {
  return (
    <AuthProvider userManager={userManager} onSigninCallback={onSigninCallback}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AuthLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bpmn" element={<BpmnEditor />} />
            <Route path="/create-process" element={<CreateProcess />}/>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
