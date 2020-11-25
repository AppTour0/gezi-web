import React, { useState, useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import IntlCurrencyInput from "react-intl-currency-input";
import {
  addService,
  getServices,
  getService,
  getTypeTours,
  addServiceItems,
  addServiceImages,
  updateService,
  deleteServiceItems,
} from "./Queries";
import { useApolloClient, useMutation } from "@apollo/client";
import { serviceModel } from "./Model";
import UserContext from "../../components/Store/Data/UserContext";
import EntContext from "../../components/Store/Data/EntContext";
import "./Add_Edit.css";
import ReactLoading from "react-loading";
import "../Loading.css";
import storage from "../../utils/firebase/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter } from "react-router";

const AddEditService = (props) => {
  var typePost = props.computedMatch.params.type;
  var idService = props.computedMatch.params.idService;
  const history = useHistory();
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const client = useApolloClient();
  const [values, setValues] = useState([]);
  const [types, setTypes] = useState([]);
  const [setService, { serviceInsert }] = useMutation(addService);
  const [setServiceItems, { itemsInsert }] = useMutation(addServiceItems);
  const [setServiceImages, { imagesInsert }] = useMutation(addServiceImages);
  const [setUpdateService, { serviceUpdate }] = useMutation(updateService);
  const [setDeleteServiceItems, { serviceDelete }] = useMutation(
    deleteServiceItems
  );
  const [imagesArray, setImagesArray] = useState([]);
  const [imagesDisplay, setImagesDisplay] = useState([]);
  const [url, setUrl] = useState("");

  const descriptionRef = useRef();
  const valueRef = useRef();
  const placeRef = useRef();

  const { idUser } = useContext(UserContext);
  const { idEnt } = useContext(EntContext);
  let now = new Date();
  let haveImages = false;
  // testa se houve alteração do dia do passeio
  const days = {
    sun: false,
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
  };

  const currencyConfig = {
    locale: "pt-BR",
    formats: {
      number: {
        BRL: {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
    },
  };

  useEffect(() => {
    getServiceAsync();
  }, []);

  const getServiceAsync = async () => {
    const { data, loadingType, error } = await client.query({
      query: getTypeTours,
    });

    setLoading(loadingType);
    setTypes(data.type_tours);

    if (typePost === "insert") {
      return setValues(serviceModel);
    }

    try {
      const { data, loadingService, error } = await client.query({
        query: getService,
        variables: { idService },
      });
      if (!loadingService) {
        setValues(data.services[0]);
        setLoading(loadingService);
        haveImages = data.services[0].services_images.length;
        days["sun"] = data.services[0].sun;
        days["mon"] = data.services[0].mon;
        days["tue"] = data.services[0].tue;
        days["wed"] = data.services[0].wed;
        days["thu"] = data.services[0].thu;
        days["fri"] = data.services[0].fri;
        days["sat"] = data.services[0].sat;
        if (haveImages > 0) {
          setImagesArray(imagesArray.concat(data.services[0].services_images));
          setImagesDisplay(
            imagesDisplay.concat(
              URL.createObjectURL(data.services[0].services_images)
            )
          );
        }
        return serviceModel;
      }
    } catch (error) {
      setError(error.message);
    }
  };

  function onChange(event) {
    const { value, name } = event.target;

    setValues({
      ...values,
      [name]: value,
    });
  }

  function onChangeCheck(event) {
    const name = event.target.id;
    const value = event.target.checked;

    setValues({
      ...values,
      [name]: value,
    });
  }

  function onChangeImage(event) {
    if (event.target.files[0]) {
      setImagesArray(imagesArray.concat(event.target.files[0]));
      setImagesDisplay(
        imagesDisplay.concat(URL.createObjectURL(event.target.files[0]))
      );
    }
  }

  async function saveImage(idService) {
    let images = [];
    let imgDefault = true;

    if (haveImages) {
      imgDefault = false;
    }

    try {
      for await (let item of imagesArray) {
        let fileName = Math.floor(Math.random() * 10000) + ".jpg";

        let ref = storage
          .ref()
          .child("ent_" + idEnt)
          .child("serv_" + idService)
          .child(fileName);

        let uploadTask = await ref.put(item);

        let downloadUrl = await uploadTask.ref.getDownloadURL();
        let path = ref.fullPath;

        images.push({
          service_id: idService,
          image_url: downloadUrl,
          default: imgDefault,
          file_path: path,
        });
        imgDefault = false;
      }
    } catch (error) {
      setError(error.message);
    }

    return images;
  }

  async function handleSubmit() {
    let formValidate = false;
    let errors = {};
    setFormErrors({});

    if (values.description.length < 15) {
      errors["description"] = "Não pode ser menor do que 15 caracteres!";
      descriptionRef.current.focus();
    }

    if (!values.value || values.value <= 0) {
      errors["value"] = "Não pode ser zero!";
      //valueRef.current.focus();
    }

    if (!values.pickup_customer && values.place == "") {
      errors["place"] = "Não pode ser vazio!";
      placeRef.current.focus();
    } else if (!values.pickup_customer && values.place.length < 3) {
      errors["place"] = "Deve ter mais que 3 caracteres!";
      placeRef.current.focus();
    }

    if (values.value) {
      let value = values.value.replace(/\D/g, "");
      let valueLen = value.length;
      let valueFinal =
        value.substring(0, valueLen - 2) +
        "." +
        value.substring(valueLen - 2, valueLen);
      values.value = valueFinal;
    }

    setFormErrors(errors);
    if (Object.entries(errors).length === 0) formValidate = true;

    var dateCreation =
      now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

    if (formValidate) {
      setLoading(true);
      if (typePost == "insert") {
        let objects = {
          name: values.name,
          description: values.description,
          value: Number(values.value),
          type_tour: values.type_tour,
          place: values.place,
          responsible: "",
          active: values.active,
          date_creation: dateCreation,
          id_enterprise: idEnt,
          init_date: dateCreation,
          final_date: dateCreation,
          user_creation: idUser,
          pickup_customer: values.pickup_customer,
          mon: values.mon,
          tue: values.tue,
          wed: values.wed,
          thu: values.thu,
          fri: values.fri,
          sat: values.sat,
          sun: values.sun,
          city: "Passeios",
        };

        try {
          await setService({
            variables: { objects: objects },
            refetchQueries: [{ query: getServices, variables: { idEnt } }],
          }).then(async (data) => {
            let idNewService = data.data.insert_services.returning[0].id;
            let items = createObjectItems(180, idNewService);
            await setServiceItems({
              variables: { objects: items },
              refetchQueries: [{ query: getServices, variables: { idEnt } }],
            });
            let images = await saveImage(idNewService);
            if (images.length == 0) {
              setLoading(false);
              return history.push("/services");
            }
            await setServiceImages({
              variables: { objects: images },
              refetchQueries: [{ query: getServices, variables: { idEnt } }],
            }).then((value) => {
              setLoading(false);
              return history.push("/services");
            });
          });
        } catch (error) {
          setLoading(false);
          setError(error.message);
        }
      } else {
        // se for update
        try {
          let changesService = {
            name: values.name,
            description: values.description,
            value: Number(values.value),
            type_tour: values.type_tour,
            place: values.place,
            active: values.active,
            pickup_customer: values.pickup_customer,
            mon: values.mon,
            tue: values.tue,
            wed: values.wed,
            thu: values.thu,
            fri: values.fri,
            sat: values.sat,
            sun: values.sun,
            city: "",
          };
          // add imagens do serviço
          let images = await saveImage(idService);
          if (images.length > 0) {
            await setServiceImages({
              variables: { objects: images },
            });
          }

          await changeWeekDay().then(async (value) => {
            await setUpdateService({
              variables: { id: idService, objects: changesService },
              refetchQueries: [{ query: getServices, variables: { idEnt } }],
            });
          });
        } catch (error) {
          return setError(error.message);
        }
      }
    }
  }

  async function changeWeekDay() {
    let typePost = "";
    // domingo
    if (days["sun"] != values.sun) {
      // insere ou deleta
      typePost = values.sun ? "insert" : "delete";
      await createOrDeleteDays(0, typePost);
    }
    // segunda
    if (days["mon"] != values.mon) {
      typePost = values.mon ? "insert" : "delete";
      await createOrDeleteDays(1, typePost);
    }
    // terça
    if (days["tue"] != values.tue) {
      typePost = values.tue ? "insert" : "delete";
      await createOrDeleteDays(2, typePost);
    }
    // quarta
    if (days["wed"] != values.wed) {
      typePost = values.wed ? "insert" : "delete";
      await createOrDeleteDays(3, typePost);
    }
    // quinta
    if (days["thu"] != values.thu) {
      typePost = values.thu ? "insert" : "delete";
      await createOrDeleteDays(4, typePost);
    }
    // sexta
    if (days["fri"] != values.fri) {
      typePost = values.fri ? "insert" : "delete";
      await createOrDeleteDays(5, typePost);
    }
    // sabado
    if (days["sat"] != values.sat) {
      typePost = values.sat ? "insert" : "delete";
      await createOrDeleteDays(6, typePost);
    }
  }

  /* se for insert cria os dias se for update altera somente */
  async function createOrDeleteDays(weekDay, typePost) {
    let today = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate();
    console.log(values.final_date);
    const diffTime = Math.abs(
      Date.parse(today) - Date.parse(values.final_date)
    );
    console.log(diffTime);
    let index = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let dates = [];

    for (var i = 0; i < index; i++) {
      console.log(Date.parse(today));
      let todayWeekday = Date.parse(today).getDay();
      console.log(todayWeekday);
      if (Date.parse(today).getDay() == weekDay) {
        dates.push(today);
      }
      today =
        now.getFullYear() + "-" + now.getMonth() + "-" + (now.getDate() + 1);
    }

    if (typePost == "delete") {
      await setDeleteServiceItems({
        variables: { dates: dates, idService: idService },
        refetchQueries: [{ query: getServices, variables: { idEnt } }],
      });
    } else {
      let objectItems = [];
      for (let index = 0; index < dates.length; index++) {
        objectItems.push({
          service_id: idService,
          date: dates[index],
          type: values.type_tour,
          sold_amount: 0,
        });
      }
      await setServiceItems({
        variables: { id: idService, objects: objectItems },
        refetchQueries: [{ query: getServices, variables: { idEnt } }],
      });
    }
  }

  /* cria as datas de acordo com os dias da semana*/
  function createObjectItems(length, idService) {
    let initDateAdded = new Date();
    let weekDay = initDateAdded.getDay;
    let initDateMore =
      initDateAdded.getFullYear() +
      "-" +
      (initDateAdded.getMonth() + 1) +
      "-" +
      initDateAdded.getDate();
    let objectItems = [];

    for (let index = 0; index < length; index++) {
      if (index > 0) {
        initDateAdded.setDate(initDateAdded.getDate() + 1);
        initDateMore =
          initDateAdded.getFullYear() +
          "-" +
          (initDateAdded.getMonth() + 1) +
          "-" +
          initDateAdded.getDate();
      }

      weekDay = initDateAdded.getDay();

      let date = {
        service_id: idService,
        date: initDateMore,
        type: values.type_tour,
        sold_amount: 0,
      };

      // domingo
      if (values.sun && weekDay == 0) {
        objectItems.push(date);
      }
      // segunda
      if (values.mon && weekDay == 1) {
        objectItems.push(date);
      }
      // terça
      if (values.tue && weekDay == 2) {
        objectItems.push(date);
      }
      // quarta
      if (values.wed && weekDay == 3) {
        objectItems.push(date);
      }
      // quinta
      if (values.thu && weekDay == 4) {
        objectItems.push(date);
      }
      // sexta
      if (values.fri && weekDay == 5) {
        objectItems.push(date);
      }
      // sabado
      if (values.sat && weekDay == 6) {
        objectItems.push(date);
      }
    }
    return objectItems;
  }

  let insert = typePost === "insert";
  let imgDefault = "/img_default.png";

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
        <div>
          <a
            name=""
            id="btn-voltar"
            className="btn btn-link"
            href="javascript:void(0)"
            role="button"
            onClick={() => history.push("/services")}
          >
            <FontAwesomeIcon icon="arrow-left"/> Voltar
          </a>
          <br></br>
          <br></br>
          {insert && <h2>Novo Passeio</h2>}
          {!insert && <h2>Alterar Passeio</h2>}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <hr></hr>
            <div className="container">
              <div className="row">
                {imagesArray.length === 0 && (
                  <img
                    src={imgDefault}
                    alt="..."
                    className="image img-thumbnail"
                  />
                )}
                {imagesDisplay.length > 0 &&
                  imagesDisplay.map((image) => (
                    <img
                      src={image}
                      alt="..."
                      className="image img-thumbnail"
                    />
                  ))}
              </div>
            </div>
            <div className="container">
              <div className="row">
                <label htmlFor="upload-file" className="btn btn-warning">
                  <FontAwesomeIcon icon="camera" />
                </label>
                <input
                  type="file"
                  name="image"
                  id="upload-file"
                  onChange={onChangeImage}
                />
              </div>
            </div>
            <br></br>
            <div className="form-group">
              <label htmlFor="name">Nome do Passeio</label>
              <input
                id="name"
                type="text"
                name="name"
                onChange={onChange}
                value={values.name}
                className="form-control"
                placeholder="Digite o nome do passeio"
                required
                minLength="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição do Passeio</label>
              <textarea
                id="description"
                type="text"
                name="description"
                onChange={onChange}
                value={values.description}
                className="form-control"
                placeholder="Digite uma descrição"
                rows="5"
                required
                minLength="15"
                ref={descriptionRef}
              ></textarea>
              {formErrors.description && (
                <small className="form-text text-danger">
                  {formErrors.description}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="value">Valor Unitário</label>
              <IntlCurrencyInput
                currency="BRL"
                config={currencyConfig}
                id="value"
                type="text"
                name="value"
                onChange={onChange}
                value={values.value}
                className="form-control"
                placeholder="Valor Unitário"
                required
                ref={valueRef}
              />
              {formErrors.value && (
                <small className="form-text text-danger">
                  {formErrors.value}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="type_tour">Tipo do Veículo</label>
              <select
                className="form-control"
                id="type_tour"
                name="type_tour"
                onChange={onChange}
                required
              >
                <option value="">Selecione o tipo de veículo</option>
                {types.map((type) => (
                  <option key={type.id} value={type.type}>
                    {type.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="place">Descreva o Local de Partida</label>
              <input
                id="place"
                type="text"
                name="place"
                onChange={onChange}
                value={values.place}
                className="form-control"
                placeholder="Local de Partida"
                ref={placeRef}
              />
              {formErrors.place && (
                <small className="form-text text-danger">
                  {formErrors.place}
                </small>
              )}
            </div>
            <hr></hr>
            <h4>Selecione os dias da semana que o passeio estará diponível</h4>
            <div className="container days">
              <div className="row">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="mon"
                    onChange={onChangeCheck}
                    value={values.mon}
                    checked={values.mon}
                  />
                  <label className="form-check-label" for="mon">
                    Segunda
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="tue"
                    onChange={onChangeCheck}
                    value={values.tue}
                    checked={values.tue}
                  />
                  <label className="form-check-label" htmlFor="tue">
                    Terça
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="wed"
                    onChange={onChangeCheck}
                    value={values.wed}
                    checked={values.wed}
                  />
                  <label className="form-check-label" htmlFor="wed">
                    Quarta
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="thu"
                    onChange={onChangeCheck}
                    value={values.thu}
                    checked={values.thu}
                  />
                  <label className="form-check-label" htmlFor="thu">
                    Quinta
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="fri"
                    onChange={onChangeCheck}
                    value={values.fri}
                    checked={values.fri}
                  />
                  <label className="form-check-label" htmlFor="fri">
                    Sexta
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="sat"
                    onChange={onChangeCheck}
                    value={values.sat}
                    checked={values.sat}
                  />
                  <label className="form-check-label" htmlFor="sat">
                    Sabado
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="sun"
                    onChange={onChangeCheck}
                    value={values.sun}
                    checked={values.sun}
                  />
                  <label className="form-check-label" htmlFor="sun">
                    Domingo
                  </label>
                </div>
              </div>
            </div>
            <hr></hr>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="active"
                onChange={onChangeCheck}
                value={values.active}
                checked={values.active}
              />
              <label className="form-check-label" htmlFor="active">
                Ativo
              </label>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="pickup_customer"
                onChange={onChangeCheck}
                value={values.pickup_customer}
                checked={values.pickup_customer}
              />
              <label className="form-check-label" htmlFor="pickup_customer">
                Buscar o cliente
              </label>
            </div>

            <button type="submit" className="btn btn-primary">
              Salvar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default withRouter(AddEditService);

/* function handleValidation() {
    let fields = this.state.fields;
    let formIsValid = true;

    //Name
    if (!fields["name"]) {
      formIsValid = false;
      setgomt = "Cannot be empty";
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
  } */
