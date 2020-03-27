import * as React from "react";
import { IFieldProps } from "./Field";
import { KeyObject } from "crypto";

export interface IFields {
  [key: string]: IFieldProps;
}

interface IFormProps {
  //The http path that will be posted to
  action: string;

  /* The props for all the fields on the form  */
  fields: IFields;

  /* A prop which allows content to be injected */
  render: () => React.ReactNode;
}

export interface IValues {
  /*[key, value] pairs for all the field values with 
    with key being the field name*/
  [key: string]: any;
}

export interface IErrors {
  /*The validation message for each field 
     (key is the field name)*/
  [key: string]: string;
}

export interface IFormState {
  //The field values
  values: IValues;

  //The Field validation error messages
  errors: IErrors;

  //Whether the form is successfully submitted
  submitSuccess?: boolean;
}

export interface IFormContext extends IFormState {
  /* Funtion that allows values in the values state to be set*/
  setValues: (values: IValues) => void;
  /* Funtion that validates a field */
  validate: (fieldName: string) => void;
}
/**
 * The context which allows state and function to be shared with Field.
 * Note that we need to pass createContext a default value which is why undefined
 * in unioned in the type
 */
export const FormContext = React.createContext({} as IFormContext);

/**
 * Validates whether a field has value
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @returns {string} - The error message
 */
export const required = (values: IValues, fieldName: string): string =>
  values[fieldName] === undefined ||
  values[fieldName] === null ||
  values[fieldName] === ""
    ? "This must be populated"
    : "";

/**
 * Validates whether a field is valid email
 * @param {IValues} values - All the values in the form
 * @param {string} fieldName - The field to validate
 * @returns {string} - The error message
 */
export const isEmail = (values: IValues, fieldName: string): string =>
  values[fieldName] &&
  values[fieldName].search(
    /^(([^<>()\\[\\]\\.,;:\s@"]+(\.[^<>()\\[\\]\\.,;:\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )
    ? "This must be a in a valid email format"
    : "";

/**
 * Validates whether a field is within a certain amount of characters
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @param {number} length - The maximum number of characters
 * @returns {string} - The error message
 */
export const maxLength = (
  values: IValues,
  fieldName: string,
  length: number
): string =>
  values[fieldName] && values[fieldName].length > length
    ? `This can not exceed ${length} characters`
    : "";

export class Form extends React.Component<IFormProps, IFormState> {
  //Constructor
  constructor(props: IFormProps) {
    super(props);

    const errors: IErrors = {};
    const values: IValues = {};

    this.state = {
      errors,
      values
    };
  }

  private validate = (fieldName: string): string => {
    let newError: string = "";
    if (
      this.props.fields[fieldName] &&
      this.props.fields[fieldName].validation
    ) {
      newError = this.props.fields[fieldName].validation!.rule(
        this.state.values,
        fieldName,
        this.props.fields[fieldName].validation!.args
      );
    }
    this.state.errors[fieldName] = newError;
    this.setState({
      errors: { ...this.state.errors, [fieldName]: newError }
    });
    return newError;
  };

  /**
   * Returns whether there is any errors in the errors
   * object that is passed in
   * @param {IErrors} errors - the field errors
   */
  private haveErrors(errors: IErrors) {
    let haveError: boolean = false;
    Object.keys(errors).map((key: string) => {
      if (errors[key].length > 0) {
        haveError = true;
      }
      return haveError;
    });
    return haveError;
  }

  /**
   * Handles form Submission
   * @param {React.FormEvent<HTMLFormElement>} e
   * - the form event
   */
  private handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    console.log(this.state.values);

    if (this.validateForm()) {
      const submitSuccess: boolean = await this.submitForm();
      this.setState({ submitSuccess });
    }
  };
  /**
   * Excecutes the validation rules for all the fields on
   * the form and sets the error state
   * @returns {boolean}
   * - Whether the form is valid or not
   */
  private validateForm(): boolean {
    const errors: IErrors = {};
    Object.keys(this.props.fields).map((fieldName: string) => {
      errors[fieldName] = this.validate(fieldName);
    });
    this.setState({ errors });
    return !this.haveErrors(errors);
  }

  /**
   * Stores new field values in state
   * @param {IValues} - The new field values
   */
  private setValues = (values: IValues) => {
    this.setState({ values: { ...this.state.values, ...values } });
  };

  /**
   * Submits the form to the http api
   * @returns {boolean}
   * -Whether the form submission
   * is successful or not
   */
  private async submitForm(): Promise<boolean> {
    try {
      const response = await fetch(this.props.action, {
        method: "post",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json"
        }),
        body: JSON.stringify(this.state.values)
      });
      if (response.status === 400) {
        /*Map the validation errors to IErrors */
        let responseBody: any;
        responseBody = await response.json();
        const errors: IErrors = {};
        Object.keys(responseBody).map((key: string) => {
          //For ASP.NET core, the field names are in title case - so
          // convert to camel case
          const fieldName = key.charAt(0).toLowerCase() + key.substring(1);
          errors[fieldName] = responseBody[key];
        });
        this.setState({ errors });
      }
      return response.ok;
    } catch (ex) {
      return false;
    }
  }

  public render() {
    const { submitSuccess, errors } = this.state;
    const context: IFormContext = {
      ...this.state,
      setValues: this.setValues,
      validate: this.validate
    };
    return (
      <FormContext.Provider value={context}>
        <form onSubmit={this.handleSubmit} noValidate={true}>
          <div className="container">
            {this.props.render()}
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-outline-primary"
                disabled={this.haveErrors(errors)}
              >
                Submit
              </button>
              {submitSuccess && (
                <div className="alert alert-success">
                  The form was successfully submitted.
                </div>
              )}
              {submitSuccess === false && !this.haveErrors(errors) && (
                <div className="alert alert-danger">
                  Sorry, an unexpected error has occurred
                </div>
              )}
              {submitSuccess === false && this.haveErrors(errors) && (
                <div className="alert alert-danger">
                  Sorry the form is invalid. Please review , adjust and try
                  again
                </div>
              )}
            </div>
          </div>
        </form>
      </FormContext.Provider>
    );
  }
}
