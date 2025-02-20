import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import BpmnEditor from "@/pages/BpmnModeler/BpmnEditor";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bpmn" element={<BpmnEditor />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
