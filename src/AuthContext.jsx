import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup

  //I need to send credentials to API to get a token
  const signup = async (credentials) => {
    try {
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const result = await response.json();
      setToken(result.token);
      setLocation("TABLET");
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  // TODO: authenticate

  //send the token to the API to authenticate the user
  const authenticate = async () => {
    try {
      if (!token) throw Error("No token found for authentication");
      const response = await fetch(`${API}/authenticate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw Error("Authentication failed");
      setLocation("TUNNEL");
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
