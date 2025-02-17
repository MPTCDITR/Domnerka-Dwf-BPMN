// AppLayout.tsx
import { NavbarMain } from '@/components/NavbarMain/NavbarMain';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

  return (
    <>
      <NavbarMain />
      <div className="d-flex flex-column min-vh-100">
        <Outlet />
      </div>
    </>
  );
};

export default AppLayout;