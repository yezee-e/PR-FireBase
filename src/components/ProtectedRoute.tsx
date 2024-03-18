import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser; //로그인 사용자 정보를 얻을 수 있다

  if (user == null) {
    return <Navigate to='/login' />;
  }
  return children;
}
