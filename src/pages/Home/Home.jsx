import React, { useContext } from "react";
import StoreContext from "../../components/Store/Context";
import UserContext from "../../components/Store/Data/UserContext";
import { useHistory } from "react-router-dom";
import "./Home.css";
import LevelContext from "../../components/Store/Data/LevelContext";

const PagesHome = () => {
  const { setToken } = useContext(StoreContext);
  const { setIdUser } = useContext(UserContext);
  const { level } = useContext(LevelContext);
  const history = useHistory();

  function Logout() {
    setToken(null);
    setIdUser(null);
    return history.push("/");
  }

  function Services() {
    return history.push("/services/0");
  }

  function Enterprises() {
    return history.push("/enterprises");
  }

  return (
    <div>
      <button type="button" onClick={() => Services()}>
        Passeios
      </button>
      {level === "master" && (
        <button type="button" onClick={() => Enterprises()}>
          Empresas
        </button>
      )}
      <button type="button" onClick={() => Logout()}>
        Sair
      </button>
    </div>
  );
};

export default PagesHome;
