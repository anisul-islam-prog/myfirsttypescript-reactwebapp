import * as React from "react";

interface IProps {
  countBy?: number;
}

interface IState {
  count: number;
}

class Description extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps> = {
    countBy: 1
  }; //declared and Initialized default props

  public state: IState = {
    count: 0
  }; // declared and initialized state

  public increase = () => {
    const countBy: number = this.props.countBy!;
    const count = this.state.count + countBy;
    this.setState({ count });
  }; // A funtion which is used to increase the value

  public render() {
    return (
      <div>
        <p>My Favorite number is {this.state.count}</p>
        <button className="btn btn-outline-dark" onClick={this.increase}>
          Increase
        </button>
      </div>
    );
  } //Render to view
}

export default Description;
