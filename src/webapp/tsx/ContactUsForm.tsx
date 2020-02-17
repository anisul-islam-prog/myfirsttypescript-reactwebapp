import * as React from "react";
import { Form } from "./components/Form";
import { Field } from "./components/Field";
import Alert from "@material-ui/lab/Alert";

export const ContactUsForm: React.FC = () => {
  return (
    <Form
      action="http://localhost:3000/api/contactus"
      render={() => (
        <React.Fragment>
          <Alert severity="info">
            Enter the Information below and we ll get back to you as soon as we
            can.
          </Alert>
          <Field id="name" label="Name" />
          <Field id="email" label="Email" />
          <Field
            id="reason"
            label="Reason"
            editor="dropdown"
            option={["", "Marketing", "Support", "Feedback", "Jobs"]}
          />
          <Field id="notes" label="Notes" editor="multilinetextbox" />
        </React.Fragment>
      )}
    />
  );
};
