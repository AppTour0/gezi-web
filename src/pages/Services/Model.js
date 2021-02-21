export const serviceModel = (object = []) => {
  let data = {
    active: true,
    amount_accents: 0,
    dateCreation: { currentTime: new Date().toLocaleString() },
    description: "",
    id: null,
    idEnterprise: 0,
    name: "",
    responsible: "",
    type_tour: "",
    userCreation: "",
    value: 0.0,
    initDate: "",
    finalDate: "",
    pickup_customer: false,
    place: "",
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: true,
    sun: true,
    city: "",
    ticket_type: "person",
    time: "",
    time1: "",
    time2: "",
    timeReturn: "",
    to_match: false,
    feedbacks: {},
    orders: {},
    empresa: {},
    services_images: {},
    typeRelation: {},
  };
  
  if (object.length == 0){
    return data;
  }

  let times = object.time != null ? object.time.split('|') : "";

  //console.log(object);

  Object.entries(object).map((item) => {
    data.active = item[0] == "active" ? item[1] : data.active;
    data.dateCreation = item[0] == "date_creation" ? item[1] : data.dateCreation;
    data.description = item[0] == "description" ? item[1] : data.description;
    data.id = item[0] == "id" ? item[1] : data.id;
    data.idEnterprise = item[0] == "id_enterprise" ? item[1] : data.idEnterprise;
    data.name = item[0] == "name" ? item[1] : data.name;
    data.responsible = item[0] == "responsible" ? item[1] : data.responsible;
    data.type_tour = item[0] == "type_tour" ? item[1] : data.type_tour;
    data.userCreation = item[0] == "user_creation" ? item[1] : data.userCreation;
    data.value = item[0] == "value" ? item[1] : data.value;
    data.initDate = item[0] == "init_date" ? item[1] : data.initDate;
    data.finalDate = item[0] == "final_date" ? item[1] : data.finalDate;
    data.pickup_customer = item[0] == "pickup_customer" ? item[1] : data.pickup_customer;
    data.place = item[0] == "place" ? item[1] : data.place;
    data.mon = item[0] == "mon" ? item[1] : data.mon;
    data.tue = item[0] == "tue" ? item[1] : data.tue;
    data.wed = item[0] == "wed" ? item[1] : data.wed;
    data.thu = item[0] == "thu" ? item[1] : data.thu;
    data.fri = item[0] == "fri" ? item[1] : data.fri;
    data.sat = item[0] == "sat" ? item[1] : data.sat;
    data.sun = item[0] == "sun" ? item[1] : data.sun;
    data.city = item[0] == "city" ? item[1] : data.city;
    data.time = item[0] == "time" ? item[1] : data.time;
    data.feedbacks = item[0] == "feedbacks" ? item[1] : data.feedbacks;
    data.orders = item[0] == "orders" ? item[1] : data.orders;
    data.empresa = item[0] == "empresa" ? item[1] : data.empresa;
    data.services_images = item[0] == "services_images" ? item[1] : data.services_images;
    data.typeRelation = item[0] == "typeTour" ? item[1] : data.typeRelation;
    data.amount_accents = item[0] == "amount_accents" ? item[1] : data.amount_accents;
    data.ticket_type = item[0] == "ticket_type" ? item[1] : data.ticket_type;
    data.time1 = times[0];
    data.time2 = times[1];
    data.to_match = times[0] == "" ? true : false;

    if(item[0] == "time_return" && item[1] != null){
      data.timeReturn  = item[1].substring(0,5)
    }else{
      data.timeReturn = data.time_return
    }
    
  })
  return data;
}
//item[1].substring(0,5)