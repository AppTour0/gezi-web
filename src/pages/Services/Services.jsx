import React, { useContext, useState } from "react";
//import { Alert } from 'reactstrap';
import { getServices, deleteService } from "./Queries";
import { useQuery, useMutation } from "@apollo/client";
import EntContext from "../../components/Store/Data/EntContext";
import { useHistory } from "react-router-dom";
import "./Services.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import ReactLoading from 'react-loading';
import "../Loading.css"

const Services = () => {
  const history = useHistory();
  const { idEnt } = useContext(EntContext);

  const [loadingPage, setLoading] = useState(false);
  const [delService] = useMutation(deleteService);
  const [errorPage, setError] = useState(null);

  const { loading, error, data } = useQuery(getServices, {
    variables: { idEnt },
  });
/* setLoading(loading);
console.log("loading da pagina " + loadingPage); */

  //setError(error);

  /* if (loadingService) return <p>Loading...</p>;
  if (errorGet) return <p>Error {errorGet}</p>; */

  function addOrEditService(type, idService) {
    return history.push("services/addEdit/" + type + "/" + idService);
  }

  /* const options = {
    title: 'Title',
    message: 'Message',
    buttons: [
      {
        label: 'Yes',
        onClick: () => alert('Click Yes')
      },
      {
        label: 'No',
        onClick: () => alert('Click No')
      }
    ],
    childrenElement: () => <div />,
    customUI: ({ onClose }) => <div>Custom UI</div>,
    closeOnEscape: true,
    closeOnClickOutside: true,
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypressEscape: () => {}
  };
   
  confirmAlert(options); */

  async function handleDelete(id) {
    confirmAlert({
      closeOnEscape: false,
      closeOnClickOutside: false,
      title: 'Atenção!',
      message: 'Tem certeza que deseja excluir este passeio?',
      buttons: [
        {
          label: 'Sim',
          onClick: (async () => {
            setLoading(true);
            try {
              const { data, loading, error } = await delService({
                variables: { id },
                refetchQueries: [{ query: getServices, variables: { idEnt } }],
              });        
              setLoading(loading);
              setError(error);
              if (error) return setError(error);
            } catch (error) {
              setLoading(false);
              setError(error.message);
            } 
          })
        },
        {
          label: 'Não',
          onClick: () => null
        }
      ]
    });
  }

  let orderLen = 0;
  let deleteActive = "btn btn-primary";

  return (
    <div>
      {errorPage && <div className="alert alert-danger" role="alert">
        <strong>{error}</strong>
      </div>}

      {loading && <ReactLoading type={"spin"} color={"#0F4C81"} height={'10%'} width={'10%'} className="loading"/>}
      {!loading &&
        <div>
          <a
            name=""
            id=""
            className="btn btn-primary"
            role="button"
            onClick={() => addOrEditService("insert", 0)}
          >
            Novo
          </a>
          <br />
          <br />
          <table className="table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>Status</th>
                <th>Editar</th>
                <th>Excluir</th>
              </tr>
            </thead>
            <tbody>
              {data.services.map(
                (service) => (
                  (orderLen = service.orders.length),
                  orderLen == 0
                    ? (deleteActive = "enable-btn")
                    : (deleteActive = "desable-btn"),
                  (
                    <tr key={service.id}>
                      <td scope="row">{service.id}</td>
                      <td>{service.name}</td>
                      <td>{service.active ? "Ativo" : "Inativo"}</td>
                      <td>
                        <a
                          name=""
                          id=""
                          className="center-btn"
                          href="javascript:void(0)"
                          onClick={() => addOrEditService("update", service.id)}
                        >
                          <FontAwesomeIcon icon="edit"/>
                        </a>
                      </td>
                      <td>
                        <a
                          name=""
                          id=""
                          className={`center-btn ${deleteActive}`}
                          href="javascript:void(0)"
                          onClick={ async () => {
                            handleDelete(service.id)
                          }}
                        >
                          <FontAwesomeIcon icon="trash"/>
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

export default Services;
