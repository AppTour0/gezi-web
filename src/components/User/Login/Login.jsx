import React, { useState, useContext } from "react";
import StoreContext from "../../Store/Context";
import UserContext from "../../Store/Data/UserContext";
import EntContext from "../../Store/Data/EntContext";
import UIButton from "../../UI/Button/Button";
import "./Login.css";
import ReactLoading from 'react-loading';
import "../../../pages/Loading.css";

import { userByEmail } from "./Queries";
import { useApolloClient } from "@apollo/client";
import { useHistory } from "react-router-dom";

function initialState() {
  return { user: "", password: "" };
}

const UserLogin = () => {
  const [values, setValues] = useState(initialState);
  const [error, setError] = useState(null);
  const { setToken } = useContext(StoreContext);
  const { setIdUser } = useContext(UserContext);
  const { setIdEnt } = useContext(EntContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  function onChange(event) {
    const { value, name } = event.target;

    setValues({
      ...values,
      [name]: value,
    });
  }

  const client = useApolloClient();
  const email = values.user;

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, loading, error } = await client.query({
        query: userByEmail,
        variables: { email },
      });

      setLoading(loading);
      setError(error);

      if (data.usuarios.length == 0) return setError("Informe um usuario e senha válido");

      if (data.usuarios.length > 0) {
        if (data.usuarios[0].enterprise == null) {
          return setError("Você não tem acesso a este módulo");
        }

        if (
          data.usuarios[0].password ===
          "3a828a0407ed80599d5fef9d71e9e8e23757b20231511da737d377a771c96c7c4044aa53a868cba99855156d1072d5c068b2174fe6a98a35a120a5866038a106"
        ) {
          setToken("1234");
          setIdUser(data.usuarios[0].id);
          setIdEnt(data.usuarios[0].enterprise.id);
          return history.push("/");
        } else {
          setError("Usuario ou senha inválido!");
        }
      } else {
        setError("Usuario ou senha inválido!");
      }
    } catch (e) {
      setError("Algo deu errado: " + e);
    }
  }

  return (
    <div>
      {error && (
        <div class="alert alert-danger" role="alert">
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
*/
