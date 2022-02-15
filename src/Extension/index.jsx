import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

import declaration from "./declaration";
import Field from "./Field";
import Dialog from "./Dialog";

import { Wrapper } from "@graphcms/uix-react-sdk";

const Extension = () => {
  return (
    <Wrapper declaration={declaration}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            <Field />
          </Route>
          <Route path="/selector" exact>
            <Dialog />
          </Route>
        </Switch>
      </BrowserRouter>
    </Wrapper>
  );
};

export default Extension;
