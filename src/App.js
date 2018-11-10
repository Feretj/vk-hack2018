import React, { Component } from "react";
import styled from "styled-components";
import "./App.css";
import axios from "axios";
import ScrollLock from "react-scrolllock";

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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  visibility: none;
  opacity: 0;
  transition: all 0.2s ease-in-out;
  z-index: -1;
  background: rgba(0, 0, 0, 0.3);
  ${({ open }) =>
    open &&
    `
    visibility: visible;
    opacity: 1;
    z-index: 20;
  `};
`;
const ModalW = styled.div`
  height: 100%;
  width: 70%;
  display: flex;
  flex-direction: row;
  visibility: none;
  background: white;
  transition: all 0.2s ease-in-out;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.3);
  opacity: 0;
  ${({ open }) =>
    open &&
    `
    visibility: visible;
    opacity: 1;
  `};
`;
const ModalIn = styled.div`
  height: 100%;

  padding: 40px;

  font-size: 25px;
  h3 {
    padding-bottom: 20px;
    padding-top: 20px;
  }
  img {
    width: 100%;
    padding-bottom: 20px;
    max-height: 500px;
    object-fit: contain;
  }

  .label {
    font-size: 20px;
    line-height: 30px;
    background: blue;
    color: white;
    border-radius: 15px;
    padding: 0 10px;
  }
  overflow-y: scroll;
  box-sizing: border-box;
`;

const ModalImages = styled.div`
  height: 100%;
  width: 200px;
  padding: 20px;
  img {
    width: 100%;
    margin-bottom: 10px;
    cursor: pointer;
    box-sizing: border-box;
  }
  img.active {
    border: 10px solid #dcdcdc;
  }
  overflow-y: scroll;
  box-sizing: border-box;
  flex-shrink: 0;
`;

class App extends Component {
  state = {
    memes: [],
    meme: null,
    image: null
  };
  componentDidMount() {
    axios.get("http://172.20.37.68:5000/memes").then(res =>
      this.setState({ memes: res.data }, () => {
        window.scrollTo(0.25 * window.innerHeight, 3200);
      })
    );
  }
  render() {
    const { meme } = this.state;
    console.log(meme);

    return (
      <div>
        <SearchWrapper>
          <Search />
        </SearchWrapper>
        <ul id="hexGrid">
          {this.state.memes.map(({ id, url }) => (
            <li
              className="hex"
              key={id}
              onClick={() => {
                axios
                  .get("http://172.20.37.68:5000/memes", { params: { id } })
                  .then(({ data }) =>
                    this.setState({ meme: data, image: data.url })
                  );
              }}
            >
              <div className="hexIn">
                <div className="hexLink">
                  <img src={url} alt="" />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Modal
          open={!!meme}
          id="modal"
          onClick={e => {
            if (e.target.id === "modal")
              this.setState({ meme: null, image: null });
          }}
        >
          <ModalW open={!!meme}>
            <ModalIn>
              <div>
                {meme && <img src={this.state.image || meme.url} alt="" />}
                <h2>{meme && meme.name}</h2>
                {meme &&
                  meme.tags.map(tag => <span className="label">{tag}</span>)}
                <h3>About</h3>
                <p>{meme && meme.about}</p>
                {meme &&
                  meme.origin && (
                    <React.Fragment>
                      <h3>Origin</h3>
                      <p>{meme && meme.origin}</p>
                    </React.Fragment>
                  )}
              </div>
            </ModalIn>
            {meme &&
              !!meme.images.length && (
                <ModalImages>
                  {[meme.url, ...meme.images].map(url => (
                    <img
                      className={this.state.image === url && "active"}
                      onClick={() => this.setState({ image: url })}
                      src={url}
                      key={url}
                      alt=""
                    />
                  ))}
                </ModalImages>
              )}
          </ModalW>
        </Modal>
        {!!meme && <ScrollLock />}
      </div>
    );
  }
}

export default App;
