import React, { Component } from "react";
import styled from "styled-components";
import "./App.css";
import axios from "axios";
import ScrollLock from "react-scrolllock";
import { hot } from "react-hot-loader";
import _ from "lodash";
import { white } from "ansi-colors";
const qurl = "172.20.37.68:5000";
const SearchWrapper = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  top: 34px;
  z-index: 10;
  width: 100%;
  flex-direction: column;
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
  margin-right: -25px;
`;

const SearchResults = styled.div`
  position: relative;
  width: 480px;
  max-height: 500px;
  overflow-y: scroll;
  border-radius: 10px;
  background: white;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.3);
  margin-top: 20px;
  padding: 20px;
  img {
    width: 100%;
    margin-bottom: 20px;
    :last-child {
      margin-bottom: 0;
    }
  }
  z-index: 20;
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
const ModalG = styled(Modal)`
  align-items: center;
  justify-content: center;
  display: flex;
  div {
    align-items: center;
    justify-content: center;
    display: flex;
    width: 500px;
    background: white;
    border-radius: 10px;
    padding: 20px;
    img {
      width: 100%;
    }
  }
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
    margin-right: 10px;
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

const Mask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ right }) =>
    right ? "rgba(0, 255, 0, 0.605)" : "rgba(255, 0, 0, 0.605)"};
`;
const MaskS = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
`;

const Wrapper = styled.div`
  .quiz .hexLink {
    background: rgb(247, 247, 66);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .generator .hexLink {
    background: red;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .images {
    display: flex;
    flex-direction: row;
    padding-bottom: 20px;
  }
  .wow {
    padding-bottom: 20px;
  }
  b {
    color: blue;
    font-size: 30px;
    line-height: 50px;
  }
`;

const Image = styled.div`
  position: relative;
  width: 33%;
  margin-right: 20px;
  box-sizing: border-box;
  cursor: pointer;
  transform: all 0.1 ease-in-out;
  ${p =>
    !p.disable &&
    `
    :hover {
      transform: scale(1.1);
    }
  `};
  img {
    padding-bottom: 0;
  }
`;

const Button = styled.button`
  border: 2px solid rgb(0, 66, 246);
  color: rgb(0, 66, 246);
  background: white;
  outline: none;
  border-radius: 20px;
  font-size: 30px;
  transition: all 0.2s ease-in-out;
  padding: 10px;
  cursor: pointer;
  :hover {
    background: rgb(0, 66, 246);
    color: #ffffff;
  }
`;

class App extends Component {
  state = {
    memes: [],
    meme: null,
    image: null,
    quiz: null,
    memesById: {},
    answers: {},
    results: [],
    generated: {}
  };
  componentDidMount() {
    axios.get(`http://${qurl}/memes`).then(res =>
      this.setState(
        { memes: res.data, memesById: _.keyBy(res.data, "id") },
        () => {
          window.scrollTo(1100, 1100);
          if (window.location.hash) {
            axios
              .get(`http://${qurl}/quiz`, {
                params: { id: window.location.hash.substr(1) }
              })
              .then(({ data }) => this.setState({ quiz: data }));
          }
        }
      )
    );
  }
  render() {
    const {
      meme,
      quiz,
      memesById,
      answers,
      generated,
      generatedId
    } = this.state;
    return (
      <Wrapper>
        <SearchWrapper>
          <div style={{ display: "flex" }}>
            <Search
              id="search"
              onChange={e => {
                if (e.target.value.length > 2)
                  axios
                    .get(`http://${qurl}/search`, {
                      params: { q: e.target.value }
                    })
                    .then(({ data }) => {
                      this.setState({ results: data.results });
                    });
                else this.setState({ results: [] });
              }}
            />
            <svg
              onClick={() => {
                document.getElementById("upload").click();
              }}
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              height="25px"
              style={{
                left: "-15px",
                position: "relative",
                zIndex: 20,
                bottom: "-8px",
                cursor: "pointer"
              }}
              x="0px"
              y="0px"
              viewBox="0 0 58.999 58.999"
            >
              <g>
                <path
                  d="M19.479,12.019c0.256,0,0.512-0.098,0.707-0.293l8.313-8.313v35.586c0,0.553,0.447,1,1,1s1-0.447,1-1V3.413l8.272,8.272
		c0.391,0.391,1.023,0.391,1.414,0s0.391-1.023,0-1.414l-9.978-9.978c-0.092-0.093-0.203-0.166-0.327-0.217
		c-0.244-0.101-0.519-0.101-0.764,0c-0.123,0.051-0.234,0.125-0.326,0.217L18.772,10.312c-0.391,0.391-0.391,1.023,0,1.414
		C18.967,11.922,19.223,12.019,19.479,12.019z"
                />
                <path
                  d="M36.499,15.999c-0.553,0-1,0.447-1,1s0.447,1,1,1h13v39h-40v-39h13c0.553,0,1-0.447,1-1s-0.447-1-1-1h-15v43h44v-43H36.499
		z"
                />
              </g>
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
              <g />
            </svg>
            <input
              type="file"
              id="upload"
              style={{ display: "none" }}
              onChange={() => {
                var data = new FormData();
                // data.append("foo", "bar");
                data.append("file", document.getElementById("upload").files[0]);
                axios.post(`http://${qurl}/isearch`, data).then(({ data }) => {
                  this.setState({ results: data.results });
                });
              }}
            />
          </div>
          {!!this.state.results.length && (
            <React.Fragment>
              <SearchResults id="results">
                {this.state.results.map(id => (
                  <img
                    src={memesById[id].url}
                    key={id}
                    alt=""
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      axios
                        .get(`http://${qurl}/memes`, { params: { id } })
                        .then(({ data }) =>
                          this.setState({ meme: data, image: data.url })
                        )
                    }
                  />
                ))}
              </SearchResults>
              <MaskS
                onClick={e => {
                  if (e.target.id !== "results" || e.target.id !== "search")
                    this.setState({ results: [] });
                }}
              />
              <ScrollLock />
            </React.Fragment>
          )}
        </SearchWrapper>
        <ul id="hexGrid">
          {this.state.memes.map(({ id, url, quiz, generator }) => (
            <li
              className={
                quiz ? "hex quiz" : generator ? "generator hex" : "hex"
              }
              key={id}
              onClick={() => {
                if (quiz) {
                  axios
                    .get(`http://${qurl}/quiz`, {
                      params: { id: quiz }
                    })
                    .then(({ data }) => this.setState({ quiz: data }));
                } else if (generator) {
                  document.getElementById("generator" + generator).click();
                } else {
                  axios
                    .get(`http://${qurl}/memes`, { params: { id } })
                    .then(({ data }) =>
                      this.setState({ meme: data, image: data.url })
                    );
                }
              }}
            >
              <div className="hexIn">
                <div className="hexLink">
                  <img src={url} alt="" />
                  {quiz && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      id="Capa_1"
                      x="0px"
                      y="0px"
                      width="100px"
                      height="100px"
                      viewBox="0 0 365.442 365.442"
                      style={{ enableBackground: "new 0 0 365.442 365.442" }}
                    >
                      <g>
                        <g>
                          <path
                            d="M212.994,274.074h-68.522c-3.042,0-5.708,1.149-7.992,3.429c-2.286,2.286-3.427,4.948-3.427,7.994v68.525    c0,3.046,1.145,5.712,3.427,7.994c2.284,2.279,4.947,3.426,7.992,3.426h68.522c3.042,0,5.715-1.144,7.99-3.426    c2.29-2.282,3.433-4.948,3.433-7.994v-68.525c0-3.046-1.14-5.708-3.433-7.994C218.709,275.217,216.036,274.074,212.994,274.074z"
                            fill="#FFFFFF"
                          />
                          <path
                            d="M302.935,68.951c-7.806-14.378-17.891-26.506-30.266-36.406c-12.367-9.896-26.271-17.799-41.685-23.697    C215.567,2.952,200.246,0,185.016,0C127.157,0,83,25.315,52.544,75.946c-1.521,2.473-2.046,5.137-1.571,7.993    c0.478,2.852,1.953,5.232,4.427,7.135l46.824,35.691c2.474,1.52,4.854,2.281,7.139,2.281c3.427,0,6.375-1.525,8.852-4.57    c13.702-17.128,23.887-28.072,30.548-32.833c8.186-5.518,18.461-8.276,30.833-8.276c11.61,0,21.838,3.046,30.692,9.132    c8.85,6.092,13.271,13.135,13.271,21.129c0,8.942-2.375,16.178-7.135,21.698c-4.757,5.518-12.754,10.845-23.986,15.986    c-14.842,6.661-28.457,16.988-40.823,30.978c-12.375,13.991-18.558,28.885-18.558,44.682v12.847c0,3.62,0.994,7.187,2.996,10.708    c2,3.524,4.425,5.283,7.282,5.283h68.521c3.046,0,5.708-1.472,7.994-4.432c2.279-2.942,3.426-6.036,3.426-9.267    c0-4.757,2.617-11.14,7.847-19.13c5.235-7.994,11.752-14.186,19.562-18.565c7.419-4.186,13.219-7.56,17.411-10.133    c4.196-2.566,9.664-6.715,16.423-12.421c6.756-5.712,11.991-11.375,15.698-16.988c3.713-5.614,7.046-12.896,9.996-21.844    c2.956-8.945,4.428-18.558,4.428-28.835C314.639,98.397,310.734,83.314,302.935,68.951z"
                            fill="#FFFFFF"
                          />
                        </g>
                      </g>
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                      <g />
                    </svg>
                  )}
                  {generator && (
                    <React.Fragment>
                      <input
                        type="file"
                        id={"generator" + generator}
                        style={{ display: "none" }}
                        onChange={() => {
                          var data = new FormData();
                          data.append("id", generator);
                          data.append(
                            "file",
                            document.getElementById("generator" + generator)
                              .files[0]
                          );
                          axios
                            .post(`http://${qurl}/generate`, data)
                            .then(({ data }) => {
                              this.setState(({ generated }) => ({
                                generated: {
                                  ...generated,
                                  [generator]:
                                    "http://" + qurl + "/static/" + data.result
                                },
                                generatedId: generator
                              }));
                            });
                        }}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        id="Capa_1"
                        x="0px"
                        y="0px"
                        viewBox="0 0 42 42"
                        width="100px"
                        height="100px"
                        style={{
                          enableBackground: "new 0 0 365.442 365.442"
                        }}
                      >
                        <path
                          d="M37.059,16H26V4.941C26,2.224,23.718,0,21,0s-5,2.224-5,4.941V16H4.941C2.224,16,0,18.282,0,21s2.224,5,4.941,5H16v11.059  C16,39.776,18.282,42,21,42s5-2.224,5-4.941V26h11.059C39.776,26,42,23.718,42,21S39.776,16,37.059,16z"
                          fill="#FFFFFF"
                        />
                        <g />
                        <g />
                        <g />
                        <g />
                        <g />
                        <g />
                        <g />
                        <g />
                        <g />
                        <g />
                        <g />
                        <g />
                        <g />
                        <g />
                        <g />
                      </svg>
                    </React.Fragment>
                  )}
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
        <ModalG
          open={!!generatedId}
          id="modal"
          onClick={e => {
            if (e.target.id === "modal") this.setState({ generatedId: null });
          }}
        >
          <div>
            {generatedId && <img src={generated[generatedId]} alt="" />}
          </div>
        </ModalG>
        <Modal
          open={!!quiz}
          id="modal"
          onClick={e => {
            if (e.target.id === "modal")
              this.setState({
                meme: null,
                image: null,
                quiz: null,
                answers: {}
              });
          }}
        >
          <ModalW open={!!quiz}>
            <ModalIn>
              <h2>Oh wow, u 4nd a quiz!11 Use ur brain</h2>
              <i>click on referecened meme</i>
              <br />
              <br />
              {quiz &&
                quiz.questions.map(({ text, memes, answer }, ind) => (
                  <React.Fragment>
                    <p>{text}</p>
                    <div className="images">
                      {memes.map((id, i) => (
                        <Image
                          onClick={() => {
                            if (answers[ind] === undefined) {
                              this.setState(({ answers }) => ({
                                answers: { ...answers, [ind]: i }
                              }));
                            }
                          }}
                          disable={answers[ind] !== undefined}
                        >
                          <img src={memesById[id].url} alt="" />
                          {answers[ind] === i && <Mask right={i === answer} />}
                        </Image>
                      ))}
                    </div>
                  </React.Fragment>
                ))}
              <div style={{ display: "flex" }}>
                <b style={{ flex: 1 }}>
                  Score:{" "}
                  {quiz &&
                    _.sum(
                      quiz.questions.map(
                        ({ answer }, ind) => (answers[ind] === answer ? 1 : 0)
                      )
                    )}
                  {"/"}
                  {quiz && quiz.questions.length}
                </b>
                <Button
                  onClick={() => {
                    const el = document.createElement("textarea");
                    el.value = "http://localhost:3000/#" + quiz.id;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand("copy");
                    document.body.removeChild(el);
                  }}
                >
                  Copy link
                </Button>
              </div>
            </ModalIn>
          </ModalW>
        </Modal>
        {(!!meme || !!quiz) && <ScrollLock />}
      </Wrapper>
    );
  }
}

export default hot(module)(App);
