import React from "react";
import { getEnterprises } from "./Queries";
import { useQuery } from "@apollo/client";
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
      <div className="front-resolv">
        <button
          id="btn-voltar"
          className="btn btn-secondary"
          onClick={() => history.goBack()}
        >
          <FontAwesomeIcon icon="arrow-left" /> Voltar
        </button>
        <br></br>
        <br></br>
        {loading &&
          <ReactLoading
            type={"spin"}
            color={"#0F4C81"}
            height={"10%"}
            width={"10%"}
            className="loading"
          />
        }
        {!loading &&      
          <div>                     
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
                          <button
                            name=""
                            id=""
                            className={`btn btn-link center-btn`}
                            onClick={() => Services(enterprise.id)}
                          >
                            <FontAwesomeIcon icon="bus"/>
                          </button>
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
