import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { ReactNode } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
  type: number;
}

interface VerifyTokenResponse {
  status: number;
  user?: any;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children,type }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {

    axios.post<VerifyTokenResponse>(`${import.meta.env.VITE_SERVER_API_URL}/verify-token`, { type }, { headers: {
          Authorization: localStorage.getItem('token')
        }})
      .then(res => {
        const { status } = res.data;
        console.log(type,status);
        if(type !== 1) {
          if (status == 1) {
            setIsVerified(true);
          } else navigate('/home');
        }
        else if (status == 2) {
          setIsVerified(true);
        } else if (status == 1) {
          navigate('/connect-more');
        } else {
          navigate('/');
        }
      })
      .catch(() => {
        navigate('/');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isVerified) return null;
  return <>{children}</>; // both connected

};

export default AuthWrapper;
