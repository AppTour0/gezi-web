import React from "react";
import Context from "./UserContext";
import useStorage from "../../../utils/useStorage";

const UserStoreProvider = ({ children }) => {
  const [idUser, setIdUser] = useStorage('idUser');

  return (
    <Context.Provider
      value={{
        idUser,
        setIdUser,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default UserStoreProvider;
