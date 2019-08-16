import React, { Component } from "react";
import Info from "./components/Info";
import Score from "./components/Score";
import Button from "./components/Button";
import DragChart from "./components/DragChart";
import "./styles.css";
import callSVG from "./img/call.js";
import crowdSVG from "./img/crowd.js";
import halfSVG from "./img/half.js";

class App extends Component {
  state = {
    info: "",
    question: "",
    answers: [],
    dis: [false, false, false, false], //we are using it in 'fifty fifty' lifeline (disabling incorrect answers)
    score: 0,
    chartData: {
      labels: ["A", "B", "C", "D"],
      datasets: [
        {
          data: [],
          backgroundColor: [
            "rgba(0, 137, 123,  1)",
            "rgba(0, 137, 123, 0.8)",
            "rgba(0, 137, 123, 0.6)",
            "rgba(0, 137, 123, 0.4)"
          ]
        }
      ]
    },
    chartOn: false,
    lifelineUsed: false
  };

  handleShowQuestion = () => {
    fetch("http://localhost:9000/question", { method: "GET" })
      .then(res => res.json())
      .then(res =>
        this.setState({
          question: res.question,
          answers: res.answers,
          score: res.score,
          info: res.loser ? "You have lost the game :(" : ""
        })
      );
  };

  //getting first question
  componentDidMount() {
    this.handleShowQuestion();
  }

  componentDidUpdate() {
    if (
      this.state.score === 10 &&
      this.state.info !== "Congratulation! You have won the quiz."
    ) {
      this.setState({
        info: "Congratulation! You have won the quiz.",
        answers: null
      });
    }
  }

  handleClickAnswer = e => {
    const index = e.target.dataset.answer;
    fetch(`answer/${index}`, { method: "POST" })
      .then(res => res.json())
      .then(res =>
        this.setState({
          score: res.score,
          chartOn: false,
          lifelineUsed: false,
          dis: [false, false, false, false]
        })
      );
    this.handleShowQuestion();
  };

  //'call to a friend' section
  handleFriendAnswer = data => {
    this.setState({
      info: data.text
    });
    if (this.state.info !== "") {
      setTimeout(() => {
        this.setState({
          info: ""
        });
      }, 3000);
    }
  };

  handleClickCall = () => {
    fetch("/rescue/call", {
      method: "GET"
    })
      .then(res => res.json())
      .then(res => this.handleFriendAnswer(res));
  };

  //'fifty fifty' section
  handleHalf = data => {
    if (typeof data.text === "string") {
      this.setState({
        info: data.text
      });
      if (this.state.info !== "") {
        setTimeout(() => {
          this.setState({
            info: ""
          });
        }, 3000);
      }
    } else {
      let newAnswers = [];
      let newDis = [];

      for (const answer of this.state.answers) {
        let newAnswer = null;
        if (data.answersToRemove.includes(answer)) {
          newAnswers.push(newAnswer);
          newDis.push(true);
        } else {
          newAnswer = answer;
          newAnswers.push(newAnswer);
          newDis.push(false);
        }
      }
      this.setState({
        answers: newAnswers,
        dis: newDis
      });
    }
  };

  handleClickHalf = () => {
    fetch("/rescue/half", { method: "GET" })
      .then(res => res.json())
      .then(res => this.handleHalf(res));
  };

  //'ask the crowd' section
  handleCrowd = data => {
    if (typeof data.text === "string") {
      this.setState({
        info: data.text
      });
      if (this.state.info !== "") {
        setTimeout(() => {
          this.setState({
            info: ""
          });
        }, 3000);
      }
    } else {
      this.setState({
        chartOn: true,
        chartData: {
          datasets: [
            {
              data: data.chart
            }
          ]
        }
      });
    }
  };

  handleClickCrowd = () => {
    fetch("/rescue/crowd", { method: "GET" })
      .then(res => res.json())
      .then(res => this.handleCrowd(res));
  };

  render() {
    let divDisp; //variable used show/hide the chart
    this.state.chartOn ? (divDisp = "block") : (divDisp = "none");
    let { answers } = this.state;

    return (
      <div className="app">
        <h1>TV Series - Quiz</h1>

        {this.state.info.includes("lost") ? null : (
          <Score score={this.state.score} />
        )}
        <Info class="tip" text={this.state.info} />

        <DragChart divdisp={divDisp} chartData={this.state.chartData} />

        {this.state.info.includes("lost") ||
        this.state.info.includes("won") ? null : (
          <div className="gameboard">
            <Button
              name="call"
              onclick={this.handleClickCall}
              content={callSVG}
            />
            <Button
              name="half"
              onclick={this.handleClickHalf}
              content={halfSVG}
            />
            <Button
              name="crowd"
              onclick={this.handleClickCrowd}
              content={crowdSVG}
            />

            <Info class="question" text={this.state.question} />

            {answers === null || answers === undefined ? null : (
              <Button
                name="answer"
                onclick={this.handleClickAnswer}
                content={answers[0]}
                set="0"
                dis={this.state.dis[0]}
              />
            )}
            {answers === null || answers === undefined ? null : (
              <Button
                name="answer"
                onclick={this.handleClickAnswer}
                content={answers[1]}
                set="1"
                dis={this.state.dis[1]}
              />
            )}
            {answers === null || answers === undefined ? null : (
              <Button
                name="answer"
                onclick={this.handleClickAnswer}
                content={answers[2]}
                set="2"
                dis={this.state.dis[2]}
              />
            )}
            {answers === null || answers === undefined ? null : (
              <Button
                name="answer"
                onclick={this.handleClickAnswer}
                content={answers[3]}
                set="3"
                dis={this.state.dis[3]}
              />
            )}
          </div>
        )}

        <footer>Piotr Kaczmarek</footer>
      </div>
    );
  }
}

export default App;
