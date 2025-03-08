// src/context/UserContext.js
import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();
export const useUserContext = () => {
  return useContext(UserContext);
};


//AUTHENTICATION
export const UserProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(
    storedUser || { name: "", isAuthenticated: false }
  );


  useEffect(() => {
    if (user.isAuthenticated) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (email) => {
    setUser({ email: email, isAuthenticated: true });
  };

  const logout = () => {
    setUser({ email: "", isAuthenticated: false });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
