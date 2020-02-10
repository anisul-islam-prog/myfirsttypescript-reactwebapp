import * as React from "react";

interface IProps {
  firstName?: string;
  lastName?: string;
}

const Header: React.FC<IProps> = (props: IProps) => (
  <h1>
    Hello, {props.firstName} {props.lastName}! Welcome to React and TypeScript
  </h1>
);

Header.defaultProps = {
  firstName: "Anisul",
  lastName: "Islam"
};

export default Header;
