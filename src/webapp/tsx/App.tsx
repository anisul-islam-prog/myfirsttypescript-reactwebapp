import React from "react";
import logo from "../resources/images/logo.svg";
import "../resources/css/App.css";
import Header from "./Header";
import Description from "./Description";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-Header">
          <img src={logo} className="App-logo" alt="logo" />
          <Header firstName="Anisul" lastName="Islam" />
        </header>
        <Description countBy={1} />
      </div>
    );
  }
}
export default App;
