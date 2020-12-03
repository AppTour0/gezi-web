import React, { useState, useContext, useEffect } from "react";
import StoreContext from "../../Store/Context";
import UserContext from "../../Store/Data/UserContext";
import EntContext from "../../Store/Data/EntContext";
import LevelContext from "../../Store/Data/LevelContext";
import UIButton from "../../UI/Button/Button";
import "./Login.css";
import ReactLoading from "react-loading";
import "../../../pages/Loading.css";

import { userByEmail } from "./Queries";
import { useApolloClient } from "@apollo/client";
import { useHistory } from "react-router-dom";
import bcrypt from "bcryptjs";

function initialState() {
  return { user: "", password: "" };
}

const UserLogin = () => {
  const [values, setValues] = useState(initialState);
  const [error, setError] = useState(null);
  const { setToken } = useContext(StoreContext);
  const { setIdUser } = useContext(UserContext);
  const { setIdEnt } = useContext(EntContext);
  const { setLevel } = useContext(LevelContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  function onChange(event) {
    const { value, name } = event.target;

    setValues({
      ...values,
      [name]: value,
    });
  }

  useEffect(() => {
    const timer = setTimeout(() => { setError('') }, 3000);
    return () => clearTimeout(timer);
  }, );

  const client = useApolloClient();
  const email = values.user;
  const password = values.password;

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    values.user = "";
    values.password = "";
    const message = "Email ou senha incorreto!";

    try {
      const { data, loading, error } = await client.query({
        query: userByEmail,
        variables: { email },
      });

      setLoading(loading);
      setError(error);

      if (data.usuarios.length === 0) {
        return setError("Informe um usuario ou senha válido");
      }

      if (data.usuarios.length > 0) {
        if (data.usuarios[0].enterprise == null) {
          return setError(message);
        }

        console.log(data.usuarios[0]);

        const hash = bcrypt.compareSync(password, data.usuarios[0].password);
        console.log(hash);
        if (hash) {
          setToken("1234");
          setIdUser(data.usuarios[0].id);
          setIdEnt(data.usuarios[0].enterprise.id);
          setLevel(data.usuarios[0].level);
          return history.push("/");
        } else {
          setError(message);
        }
      } else {
        setError(message);
      }
    } catch (e) {
      setError("Algo deu errado: " + e);
    }
  }

  return (
    <div>
      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>{error}</strong>
        </div>
      )}
      {loading && (
        <ReactLoading
          type={"spin"}
          color={"#0F4C81"}
          height={"10%"}
          width={"10%"}
          className="loading"
        />
      )}
      {!loading && (
        <div className="user-login">
          <h1 className="user-login__title">Acessar o Sistema</h1>
          <form onSubmit={async (event) => submit(event)}>
            <div className="user-login__form-control">
              <label htmlFor="user">Usuário</label>
              <input
                id="user"
                type="text"
                name="user"
                onChange={onChange}
                value={values.email}
              />
            </div>
            <div className="user-login__form-control">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                name="password"
                onChange={onChange}
                value={values.password}
              />
            </div>
            <UIButton
              type="submit"
              theme="contained-green"
              className="user-login__submit-button"
              rounded
            >
              Entrar
            </UIButton>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserLogin;

/* 

{error && (
          <div className="user-login__error">{error}</div>
        )}


         <div className="alert alert-danger" role="alert">
          <strong>{error}</strong>
        </div> 
*/
