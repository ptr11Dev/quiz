import React from "react";
import Chart from "./Chart";
import Draggable from "react-draggable";

class DragChart extends React.Component {
  render() {
    return (
      <Draggable
        axis="both"
        handle=".handle"
        position={null}
        // bounds="parent"
        grid={[5, 5]}
        scale={1}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        bounds="html"
      >
        <div className="handle chart" style={{ display: this.props.divdisp }}>
          <Chart chartData={this.props.chartData} />
        </div>
      </Draggable>
    );
  }
}
export default DragChart;
