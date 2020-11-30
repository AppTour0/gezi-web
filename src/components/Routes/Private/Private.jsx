import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import Footer from "../../../pages/Footer";
import Header from "../../../pages/Header";
import StoreContext from "../../Store/Context";

const RoutesPrivate = ({ component: Component, ...rest }) => {
  const { token } = useContext(StoreContext);

  return (
    <Route
      {...rest}
      render={
        () =>
          token ? (
            <div>
              <Header></Header>
              <div className="container">
                <Component {...rest} />
              </div>
              <Footer></Footer>
            </div>
          ) : (
            <Redirect to="/login" />
          )
        /*  if(token){
           
        }else{
          
        } */
      }
    />
  );
};

export default RoutesPrivate;
