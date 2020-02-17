import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Header from "./Header";
import Description from "./Description";
import { ContactUsForm } from "./ContactUsForm";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <div className="mt-2">
          <div className="container">
            <header className="App-Header">
              {/* <img src={logo} className="App-logo" alt="logo" /> */}
              <Header firstName="Anisul" lastName="Islam" />
            </header>
            <Description countBy={1} />
          </div>
        </div>
        <div className="mt-3">
          <ContactUsForm />
        </div>
      </div>
    );
  }
}
export default App;
