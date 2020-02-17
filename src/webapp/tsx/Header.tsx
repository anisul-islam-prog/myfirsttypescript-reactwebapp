import * as React from "react";

interface IProps {
  firstName?: string;
  lastName?: string;
}
class Header extends React.Component<IProps> {
  public static defaultProps: Partial<IProps> = {
    firstName: "Anisul",
    lastName: "Islam"
  }; // declared and initialized the props value

  public render() {
    return (
      <h1>
        Hello, {this.props.firstName} {this.props.lastName}! Welcome to React
        and TypeScript
      </h1>
    );
  }
}
// const Header: React.FC<IProps> = (props: IProps) => (
//   <h1>
//     Hello, {props.firstName} {props.lastName}! Welcome to React and TypeScript
//   </h1>
// );

// Header.defaultProps = {
//   firstName: "Anisul",
//   lastName: "Islam"
// };

export default Header;
