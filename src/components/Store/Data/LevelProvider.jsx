import React from "react";
import Context from "./LevelContext";
import useStorage from "../../../utils/useStorage";

const LevelStoreProvider = ({ children }) => {
  const [level, setLevel] = useStorage('isLevel');

  return (
    <Context.Provider
      value={{
        level,
        setLevel,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default LevelStoreProvider;
