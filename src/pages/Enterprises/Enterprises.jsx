import React, { useContext, useState } from "react";
import { getEnterprises } from "./Queries";
import { useQuery } from "@apollo/client";
import EntContext from "../../components/Store/Data/EntContext";
import { useHistory } from "react-router-dom";
import "./Enterprises.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import ReactLoading from 'react-loading';
import "../Loading.css"

const Enterprises = () => {
  const history = useHistory();
  const { loading, error, data } = useQuery(getEnterprises);

  function Services(id) {
    return history.push("/services/"+id);
  }

  let statusColor = "status-black";

  return (
    <div>
      {!loading &&
        <div>
           <a
            name=""
            id="btn-voltar"
            className="btn btn-link"
            href="javascript:void(0)"
            role="button"
            onClick={() => history.push("/")}
          >
            <FontAwesomeIcon icon="arrow-left" /> Voltar
          </a>
          <br></br>
          <br></br>
          <table className="table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>Status</th>
                <th>Passeios</th>
              </tr>
            </thead>
            <tbody>
              {data.empresas.map(
                (enterprise) => (
                  enterprise.ativo ? statusColor = "status-black" : statusColor = "status-red",
                  (
                    <tr key={enterprise.id}>
                      <td className={statusColor} scope="row">{enterprise.id}</td>
                      <td className={statusColor}>{enterprise.nome}</td>
                      <td className={statusColor} >{enterprise.ativo ? "Ativo" : "Inativo"}</td>
                      <td>
                        <a
                          name=""
                          id=""
                          className={`center-btn`}
                          href="javascript:void(0)"
                          onClick={() => Services(enterprise.id)}
                        >
                          <FontAwesomeIcon icon="bus"/>
                        </a>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
};

export default Enterprises;
