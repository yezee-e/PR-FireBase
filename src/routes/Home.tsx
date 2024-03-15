import React from 'react';
import { auth } from '../firebase';

function Home() {
  const logout = () => {
    auth.signOut();
  };
  return (
    <h1>
      <button onClick={logout}>Log Out</button>
    </h1>
  );
}

export default Home;
