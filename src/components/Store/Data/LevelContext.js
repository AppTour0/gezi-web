import { createContext } from 'react';

const LevelContext = createContext({
  level: "",
  setLevel: () => {},
});

export default LevelContext;
