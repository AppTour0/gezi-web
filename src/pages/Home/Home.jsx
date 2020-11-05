import React, { useContext, useState } from "react";
import StoreContext from "../../components/Store/Context";
import { useHistory } from "react-router-dom";
import "./Home.css";
import { Link } from "react-router-dom";

const PagesHome = () => {
  const { setToken } = useContext(StoreContext);
  const history = useHistory();

  function Logout() {
    setToken(null);
    return history.push("/");
  }

  function Services() {
    return history.push("/services");
  }

  return (
    <div className="pages-home">
      Parabéns, você conseguiu
      <br />
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
