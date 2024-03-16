import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import styled from 'styled-components';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Button = styled.span`
  background-color: white;
  width: 100%;
  margin-top: 15px;
  color: black;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function GithubButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider); //signInWithRedirect은 팝업 형태가 아니라 로그인창으로 이동
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src='github-logo.svg' />
      continue with Github
    </Button>
  );
}
