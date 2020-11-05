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
    }
  }
`;

export const ADD_SERVICE = gql`
mutation createService($objects: [services_insert_input!]!) {
  insert_services(objects: $objects) {
    returning {
      id
    }
  }
}
`;

export const UPDATE_SERVICE = gql`
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

export const DEL_SERVICE = gql`
mutation deleteService($id: Int!) {
  delete_services(where: {id: {_eq: $id}}) {
    affected_rows
  }
}
`;