import { createContext } from 'react';

const UserContext = createContext({
  id: "0",
  setIdUser: () => {},
});

export default UserContext;
