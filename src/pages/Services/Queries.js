import gql from 'graphql-tag';

export const getServices = gql` 
  query getServices($idEnt: Int!){
    services (where: {
      _and: [
              {id_enterprise: {_eq: $idEnt}}
            ] 
      }, order_by: {id: asc}) 
      {
      active
      amount_tour
      date_creation
      description
      final_date
      id_enterprise
      id
      init_date
      name
      responsible
      type_tour
      user_creation
      value
      pickup_customer
      place
      empresa {
        cidade
      }
      services_images{
        id
        service_id
        image_url
        default
      }
      mon
      tue
      wed
      thu
      fri
      sat
      sun
      feedbacks{
        general
        comment
      }
      city
      time
      ticket_type
      amount_accents
      orders{
        id
      }
      typeTour{
        description
      }
    }
  }
`;

export const getService = gql` 
  query getServices($idService: Int!){
    services (where: {
      _and: [
              {id: {_eq: $idService}}
            ] 
      }, order_by: {id: asc}) 
      {
      active
      amount_tour
      date_creation
      description
      final_date
      id_enterprise
      id
      init_date
      name
      responsible
      type_tour
      user_creation
      value
      pickup_customer
      place
      empresa {
        cidade
      }
      services_images{
        id
        service_id
        image_url
        default
      }
      mon
      tue
      wed
      thu
      fri
      sat
      sun
      feedbacks{
        general
        comment
      }
      city
      time
      ticket_type
      amount_accents
      orders{
        id
      }
      typeTour{
        description
      }
    }
  }
`;

export const addService = gql`
mutation createService($objects: [services_insert_input!]!) {
  insert_services(objects: $objects) {
    returning {
      id
    }
  }
}
`;

export const updateService = gql`
mutation update_services($id: Int!, $changes: services_set_input) {
  update_services(
    where: {id: {_eq: $id}},
    _set: $changes
  ) {
    affected_rows
    returning {
      id
    }
  }
}
`;

export const deleteService = gql`
mutation deleteService($id: Int!) {
  delete_services(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`;

export const getTypeTours = gql`
  query getTypeTours{
    type_tours(order_by: {id: asc}) {
      description
      id
      image
      type
    }
  }
`;

export const addServiceItems = gql`
  mutation createServiceItems($objects: [services_items_insert_input!]!) {
    insert_services_items(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const updateServiceItems = gql`
  mutation updateServiceItems($id: Int, $date: timestamptz, $changes: services_items_set_input) {
    update_services_items(
      where: {service_id: {_eq: $id}, 
      _and: {date: {_eq: $date}}}, 
      _set: $changes) {
      returning {
        id
      }
    }
  }
`;

export const addServiceImages = gql`
  mutation createServiceImages($objects: [services_images_insert_input!]!) {
    insert_services_images(objects: $objects) {
      returning {
        id
      }
    }
  }
`;

export const deleteServiceImages = gql`
  mutation deleteServiceImages {
    delete_services_images(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`;

export const getServiceImages = gql`
  query getImages($idService: Int){
    services_images(
      where: {service_id: {_eq: $idService}}, 
      order_by: {id: asc}) 
    {
      default
      id
      image_url
      service_id
      file_path
    }
  }
`;

export const deleteServiceItems = gql`
  mutation deleteServiceItems($dates: [timestamptz!] , $idService: Int) {
    delete_services_items(where: {
      date: {_in: $dates}, 
      _and: {service_id: {_eq: $idService}}
    }) {
      affected_rows
    }
  }
`;