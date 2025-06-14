import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import type { ReactNode } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
}

interface VerifyTokenResponse {
  status: number;
  user?: any;
}

const ProfileAuth: React.FC<AuthWrapperProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const navigate = useNavigate();
  const { UserId } = useParams<{ UserId: string }>()

  useEffect(() => {

    axios.post<VerifyTokenResponse>(`${import.meta.env.VITE_SERVER_API_URL}/profile-verify`, { UserId }, { headers: {
          Authorization: localStorage.getItem('token')
        }})
      .then(res => {
        const { status } = res.data;
        if(status) setIsVerified(true);
        else navigate('/home');
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

export default ProfileAuth;
