import React, {useContext} from "react";
//import { Alert } from 'reactstrap';
import { getServices } from "./Queries";
import { useQuery } from "@apollo/client";
import UserContext from "../../components/Store/Data/UserContext";
import { useHistory } from "react-router-dom";

const Services = () => {
  const history = useHistory();
  const { idUser } = useContext(UserContext);
  var idEnt = idUser;

  const { loading, error, data } = useQuery(getServices, {
    variables: { idEnt },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error}</p>;

  function addOrEditService(type, idService){
    return history.push("services/addEdit/"+type+"/"+idService);
  }

  return (
    <div class="container">
      <a name="" id="" class="btn btn-primary" role="button" onClick={() => addOrEditService("insert",0)}>
        Novo
      </a>
      <br />
      <br />
      <table class="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Ação</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {data.services.map(service => (
            <tr key={service.id}>
              <td scope="row">{service.id}</td>
              <td>{service.name}</td>
              <td>
                <a
                  name=""
                  id=""
                  class="btn btn-primary"
                  href="javascript:void(0)"
                  role="button"
                  onClick={() => addOrEditService("update",service.id)}
                >
                  Alterar
                </a>
              </td>
              <td>
                <a
                  name=""
                  id=""
                  class="btn btn-primary"
                  href="javascript:void(0)"
                  role="button"
                >
                  Deletar
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
};

export default Services;
