import React, { useContext } from "react";
import StoreContext from "../../components/Store/Context";
import UserContext from "../../components/Store/Data/UserContext";
import { useHistory } from "react-router-dom";
import "./Home.css";

const PagesHome = () => {
  const { setToken } = useContext(StoreContext);
  const { setIdUser } = useContext(UserContext);
  const history = useHistory();

  function Logout() {
    setToken(null);
    setIdUser(null);
    return history.push("/");
  }

  function Services() {
    return history.push("/services");
  }

  return (
    <div>
      <button type="button" onClick={() => Services()}>
        Passeios
      </button>
      <button type="button" onClick={() => Logout()}>
        Sair
      </button>
    </div>
  );
};

export default PagesHome;
