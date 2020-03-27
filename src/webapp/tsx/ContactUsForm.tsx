import * as React from "react";
import { Form, required, isEmail, maxLength, IFields } from "./components/Form";
import { Field } from "./components/Field";
import Alert from "@material-ui/lab/Alert";

export const ContactUsForm: React.FC = () => {
  const fields: IFields = {
    name: {
      id: "name",
      label: "Name",
      validation: { rule: required }
    },
    email: {
      id: "email",
      label: "Email",
      validation: { rule: required }
    },
    reason: {
      id: "reason",
      label: "Reason",
      editor: "dropdown",
      options: ["", "Marketing", "Support", "Feedback", "Jobs"],
      validation: { rule: required }
    },
    notes: {
      id: "notes",
      label: "Notes",
      editor: "multilinetextbox",
      validation: { rule: maxLength, args: 1000 }
    }
  };
  return (
    <Form
      action="http://localhost:3000/api/contactus"
      fields={fields}
      render={() => (
        <React.Fragment>
          <Alert severity="info">
            Enter the Information below and we ll get back to you as soon as we
            can.
          </Alert>
          <Field {...fields.name} />
          <Field {...fields.email} />
          <Field {...fields.reason} />
          <Field {...fields.notes} />
        </React.Fragment>
      )}
    />
  );
};
