import React, { useState } from "react";
import Login from "./Login.tsx";
import Dashboard from "./Dashboard.tsx";

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuthentication = () => {
    setAuthenticated(true);
  };

  return (
    <div>
      {!authenticated ? (
        <Login onAuthentication={handleAuthentication} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
};

export default App;
