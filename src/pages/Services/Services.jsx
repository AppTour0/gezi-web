import React from "react";
//import { Alert } from 'reactstrap';
import { getServices } from "./Queries";
import { useQuery } from "@apollo/client";

const Services = (props) => {
  var idEnt = props.idEnt;
  const { loading, error, data } = useQuery(getServices, {
    variables: { idEnt },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error}</p>;

  return (
    <div class="container">
      <a name="" id="" class="btn btn-primary" role="button">
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
          {data.services.map(({ id, name }) => (
            <tr key="id">
              <td scope="row">{id}</td>
              <td>{name}</td>
              <td>
                <a
                  name=""
                  id=""
                  class="btn btn-primary"
                  href="javascript:void(0)"
                  role="button"
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
