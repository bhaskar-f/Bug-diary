import { createContext, useEffect, useState } from "react";
import api from "./axios.jsx";

export const userContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState({
    username: "",
    email: "",
  });

  async function getUser() {
    try {
      const hasToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!hasToken) return null;

      const response = await api.get("/auth/me");
      setUser({
        username: response.data.username || "",
        email: response.data.email || "",
      });
      return response.data;
    } catch (error) {
      setUser({ username: "", email: "" });
      return null;
    }
  }

  function clearUser() {
    setUser({ username: "", email: "" });
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <userContext.Provider value={{ user, setUser, getUser, clearUser }}>
      {children}
    </userContext.Provider>
  );
}
