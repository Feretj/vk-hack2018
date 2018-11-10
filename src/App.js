import React, { Component } from "react";
import styled from "styled-components";
import "./App.css";
import axios from "axios";

const SearchWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  top: 34px;
  z-index: 10;
  width: 100%;
`;

const Search = styled.input`
  background: #ffffff;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.3);
  border-radius: 90px;
  font-size: 30px;
  z-index: 10;
  border: 0;
  padding: 5px 20px;
  outline: none;
  width: 500px;
`;

class App extends Component {
  state = {
    memes: []
  };
  componentDidMount() {
    axios.get("http://172.20.37.68:5000/memes").then(res =>
      this.setState({ memes: res.data }, () => {
        window.scrollTo(500, 3200);
      })
    );
  }
  render() {
    return (
      <div>
        <SearchWrapper>
          <Search />
        </SearchWrapper>
        <ul id="hexGrid">
          {this.state.memes.map(({ id, url }) => (
            <li className="hex" key={id}>
              <div className="hexIn">
                <div className="hexLink">
                  <img src={url} alt="" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
