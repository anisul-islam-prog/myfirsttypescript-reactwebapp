import * as React from "react";

interface IFormProps {
  //The http path that will be posted to
  action: string;

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
}
/**
 * The context which allows state and function to be shared with Field.
 * Note that we need to pass createContext a default value which is why undefined
 * in unioned in the type
 */
export const FormContext = React.createContext({} as IFormContext);

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
    if (!this.state.values) {
      return false;
    }
    return true;
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
    return true;
  }

  public render() {
    const { submitSuccess, errors } = this.state;
    const context: IFormContext = {
      ...this.state,
      setValues: this.setValues
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
                <div className="alert alert-success" role="info">
                  The form was successfully submitted.
                </div>
              )}
              {submitSuccess == false && !this.haveErrors(errors) && (
                <div className="alert alert-danger" role="alert">
                  Sorry, an unexpected error has occurred
                </div>
              )}
              {submitSuccess == false && this.haveErrors(errors) && (
                <div className="alert alert-danger" role="alert">
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
