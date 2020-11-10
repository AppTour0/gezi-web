import React, { useState, useContext, useEffect } from "react";
import { Mutation } from "react-apollo";

import { ADD_SERVICE, getServices, getService, getTypeTours } from "./Queries";
import { useApolloClient } from "@apollo/client";
import { serviceModel } from "./Model";
import "./Add_Edit.css";

const AddEditService = (props) => {
  var typePost = props.computedMatch.params.type;
  var idService = props.computedMatch.params.idService;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  const [values, setValues] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    getServiceAsync();
  }, []);

  const getServiceAsync = async () => {
    const { data, loadingType, error } = await client.query({
      query: getTypeTours,
    });

    setLoading(loadingType); 
    setTypes(data.type_tours);

    if (typePost == "insert") {
      return serviceModel;
    }

    try {
      const { data, loadingService, error } = await client.query({
        query: getService,
        variables: { idService },
      });
      if (!loadingService) {
        setValues(data.services[0]);
        setLoading(loadingService);
        return serviceModel;
      }
    } catch (error) {
      setError(error);
    }
  };

  function onChange(event) {
    const { value, name } = event.target;

    setValues({
      ...values,
      [name]: value,
    });
  }

  function handleValidation() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    //Name
    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Cannot be empty";
    }

    if (typeof fields["name"] !== "undefined") {
      if (!fields["name"].match(/^[a-zA-Z]+$/)) {
        formIsValid = false;
        errors["name"] = "Only letters";
      }
    }

    //Email
    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "Cannot be empty";
    }

    if (typeof fields["email"] !== "undefined") {
      let lastAtPos = fields["email"].lastIndexOf("@");
      let lastDotPos = fields["email"].lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields["email"].indexOf("@@") == -1 &&
          lastDotPos > 2 &&
          fields["email"].length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["email"] = "Email is not valid";
      }
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  function handleSubmit(addService) {
    if (this.state.content) {
      addService({
        variables: {
          objects: this.state.content,
        },
        refetchQueries: [{ query: getServices }],
      });
      this.setState({
        content: "",
      });
    }
  }

  let insert = typePost == "insert";

  return (
  <div>

  {loading && <h1>Loading...</h1>}


  {!loading && <Mutation mutation={ADD_SERVICE}>
      {(addService, { data }) => (
        <div className="container">
        
          {insert && <h2>Novo Passeio</h2>}
          {!insert && <h2>Alterar Passeio</h2>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(addService);
            }}
          >
            <div class="form-group">
              <label for="name">Nome do Passeio</label>
              <input
                id="name"
                type="text"
                name="name"
                onChange={onChange}
                value={values.name}
                class="form-control"
                placeholder="Digite o nome do passeio"
                required
                minLength="3"
              />
            </div>

            <div class="form-group">
              <label for="description">Descrição do Passeio</label>
              <textarea
                id="description"
                type="text"
                name="description"
                onChange={onChange}
                value={values.description}
                class="form-control"
                placeholder="Digite uma descrição"
                rows="5"
                required
                minLength="15"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="price">Valor Unitário</label>
              <input
                id="price"
                type="text"
                name="price"
                onChange={onChange}
                value={values.price}
                class="form-control"
                placeholder="Valor Unitário"
                required
              />
              <small id="helpId" class="form-text text-muted">
                Help text
              </small>
            </div>

            <div class="form-group">
              <label for="amount">Quantidade de acentos por dia!</label>
              <input
                id="amount"
                type="number"
                name="amount"
                onChange={onChange}
                value={values.amount}
                defaultValue="1"
                class="form-control"
                placeholder="Quantidade"
                required
              />
              <small id="helpId" class="form-text text-muted">
                Help text
              </small>
            </div>

            <div class="form-group">
              <label for="typeTour">Tipo do Veículo</label>
              <select
                class="form-control"
                id="typeTour"
                name="typeTour"
                onChange={onChange}
                required
              >
                <option value="">Selecione o tipo de veículo</option>
                {types.map(type => (
                  <option key={type.id} value={type.type}>{type.description}</option>
                ))}
              </select>
            </div>

            <div class="form-group">
              <label for="place">Descreva o Local de Partida</label>
              <input
                id="place"
                type="text"
                name="place"
                onChange={onChange}
                value={values.place}
                class="form-control"
                placeholder="Local de Partida"
                required
                minLength="3"
              />
            </div>
            <hr></hr>
            <h4>Selecione os dias da semana que o passeio estará diponível</h4>
            <div class="container days">
              <div class="row">
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="mon"
                    onChange={onChange}
                    value={values.mon}
                    defaultChecked="true"
                  />
                  <label class="form-check-label" for="mon">
                    Segunda
                  </label>
                </div>
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="tue"
                    onChange={onChange}
                    value={values.tue}
                    defaultChecked="true"
                  />
                  <label class="form-check-label" for="tue">
                    Terça
                  </label>
                </div>
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="wed"
                    onChange={onChange}
                    value={values.wed}
                    defaultChecked="true"
                  />
                  <label class="form-check-label" for="wed">
                    Quarta
                  </label>
                </div>
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="thu"
                    onChange={onChange}
                    value={values.thu}
                    defaultChecked="true"
                  />
                  <label class="form-check-label" for="thu">
                    Quinta
                  </label>
                </div>
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="fri"
                    onChange={onChange}
                    value={values.fri}
                    defaultChecked="true"
                  />
                  <label class="form-check-label" for="fri">
                    Sexta
                  </label>
                </div>
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="sat"
                    onChange={onChange}
                    value={values.sat}
                    defaultChecked="true"
                  />
                  <label class="form-check-label" for="sat">
                    Sabado
                  </label>
                </div>
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="sun"
                    onChange={onChange}
                    value={values.sun}
                    defaultChecked="true"
                  />
                  <label class="form-check-label" for="sun">
                    Domingo
                  </label>
                </div>
              </div>
            </div>
            <hr></hr>
            <div class="form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="active"
                onChange={onChange}
                value={values.active}
                defaultChecked="true"
              />
              <label class="form-check-label" for="active">
                Ativo
              </label>
            </div>

            <div class="form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="pickup"
                onChange={onChange}
                value={values.pickup}
              />
              <label class="form-check-label" for="pickup">
                Buscar o cliente
              </label>
            </div>

            <button type="submit" class="btn btn-primary">
              Salvar
            </button>
          </form>
        </div>
      )}
    </Mutation>}
  </div>
  
  );
};

export default AddEditService;
