import React from "react";
import Context from "./EntContext";
import useStorage from "../../../utils/useStorage";

const EntStoreProvider = ({ children }) => {
  const [idEnt, setIdEnt] = useStorage('isEnt');

  return (
    <Context.Provider
      value={{
        idEnt,
        setIdEnt,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default EntStoreProvider;
