// src/pages/Dashboard.tsx
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { isAuthenticated, userProfile, logout, login } = useAuth();

  if (!isAuthenticated) {
    return <button onClick={login}>login</button>;
  }

  return (
    <div>
      <h1>Welcome, {userProfile?.username}!</h1>
      <p>Email: {userProfile?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
