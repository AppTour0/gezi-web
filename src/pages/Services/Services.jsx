import React, { useContext, useState, useEffect } from "react";
//import { Alert } from 'reactstrap';
import { getServices, deleteService, getServiceImages } from "./Queries";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import EntContext from "../../components/Store/Data/EntContext";
import { useHistory } from "react-router-dom";
import "./Services.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import ReactLoading from "react-loading";
import "../Loading.css";
import storage from "../../utils/firebase/index";

const Services = (props) => {
  let idEntForProps = props.computedMatch.params.id;
  const history = useHistory();
  let { idEnt } = useContext(EntContext);
  if (idEntForProps > 0) {
    idEnt = idEntForProps;
  }
  const client = useApolloClient();
  const [loading, setLoading] = useState(true);
  const [delService] = useMutation(deleteService);
  const [error, setError] = useState(null);
  const [values, setValues] = useState([]);

  useEffect(() => {
    getServiceAsync();
    const timer = setTimeout(() => {
      setError("");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const getServiceAsync = async () => {
    await client.query({
      query: getServices,
      variables: { idEnt },
    }).then((data) => {
      setValues(data.data);
      setLoading(data.loading);
    });
  }
  /* const { loading, error, data } = useQuery(getServices, {
    variables: { idEnt },
  }); */

  function addOrEditService(type, idService) {
    if (idEntForProps > 0) {
      return history.push(
        "/services/addEdit/" + type + "/" + idService + "/" + idEntForProps
      );
    } else {
      return history.push("/services/addEdit/" + type + "/" + idService);
    }
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
      title: "Atenção!",
      message: "Tem certeza que deseja excluir este passeio?",
      buttons: [
        {
          label: "Sim",
          onClick: async () => {
            setLoading(true);
            try {
              const { data } = await client.query({
                query: getServiceImages,
                variables: { idService: id },
              });
              /* deleta as imagens */
              let images = data.services_images;
              for await (let item of images) {
                await storage.ref().child(item.file_path).delete();
              }
              /* deleta os serviços */
              //const { loading, error } = 
              await delService({
                variables: { id },
                refetchQueries: [{ query: getServices, variables: { idEnt } }],
              }).then((values) => {
                setLoading(values.loading);
                setError(values.error);
              });            
              
            } catch (error) {
              setLoading(false);
              setError(error.message);
            }
          },
        },
        {
          label: "Não",
          onClick: () => null,
        },
      ],
    });
  }

  function back() {
    idEntForProps == 0 ? history.push("/") : history.push("/enterprises");
  }

  let orderLen = 0;
  let deleteActive = "btn btn-primary";

  return (
    <div className="container">
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
        <div>
          <br></br>
          <a
            name=""
            id="btn-voltar"
            className="btn btn-secondary"
            href="javascript:void(0)"
            role="button"
            onClick={() => back()}
          >
            <FontAwesomeIcon icon="arrow-left" /> Voltar
          </a>          
          <br></br>
          <a
            name=""
            id=""
            className="btn btn-primary btn-lg"
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
              {values.services.map(
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
                          <FontAwesomeIcon icon="edit" />
                        </a>
                      </td>
                      <td>
                        <a
                          name=""
                          id=""
                          className={`center-btn ${deleteActive}`}
                          href="javascript:void(0)"
                          onClick={async () => {
                            handleDelete(service.id);
                          }}
                        >
                          <FontAwesomeIcon icon="trash" />
                        </a>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Services;
