import React, { useState, useContext, useEffect } from 'react'
import { Mutation } from 'react-apollo';

import {ADD_SERVICE, getServices} from './queries'

const serviceModel = {
    active: true,
    amountTour: 0,
    dateCreation: { currentTime: new Date().toLocaleString() },
    description: "",
    id: null,
    idEnterprise: 0,
    name: "",
    responsible: "",
    typeTour: "",
    userCreation: "",
    value: "",
    initDate: "",
    finalDate: "",    
    pickupCustomer: false,
    place: "",    
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,    
    city: "",
    feedbacks: {},
    orders: {},
    empresa: {},
    images: {},
    typeRelation: {},
}

function initialState(typePost) {
  if (typePost == "update"){
    return serviceModel;
  }  
  return serviceModel;
}

const AddService = () => {
  const [values, setValues] = useState(initialState);
  var state = {
    content: ''
  }

  function onChange(event) {
    const { value, name } = event.target;

    setValues({
      ...values,
      [name]: value,
    });
  }

  function handleSubmit (addService) {
    if(this.state.content){
        addService({ 
            variables: { 
                objects: this.state.content
            },refetchQueries:[{query:getServices}]
        })
        this.setState({
        content: ""
        });
    }
  }
  
    return (
      <Mutation mutation={ADD_SERVICE}>
      {(addService, { data }) => (
      <div>
        <form onSubmit={e => {
                            e.preventDefault();
                            handleSubmit(addService);
                        }}
        >
          <label>Add a new todo:</label>
         
          <input type="text" onChange={this.handleChange} value={this.state.content} />
          <input type="submit"/>
        </form>
      </div>
       )}
       </Mutation>
    )
  
}


export default AddService;