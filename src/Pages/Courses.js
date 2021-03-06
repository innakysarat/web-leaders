import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Container,
  Tab,
  Col,
  Row,
  Nav,
  Form,
  Alert,
  FormGroup,
  Modal,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

import Context from "../context";
import CourseItem from "../Components/CourseItem";

const Courses = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [country, setCountry] = useState("");
  const [subject, setSubject] = useState("");
  const [language, setLanguage] = useState("");
  const [price, setPrice] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [isEdit, setIsEdit] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const { setIsLogin } = useContext(Context);
  const [internships, setInternships] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLogin(true);
    } else {
      return;
    }

    axios
      .get("https://internships-hse.herokuapp.com/api/students", {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        axios
          .get(
            `https://internships-hse.herokuapp.com/management/api/students/organizations/${response.data.user_id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
              },
            }
          )
          .then((response) => {
            response.data[0] && setInternships(response.data[0].internships);
          });
      });
  }, [setInternships, setIsLogin]);

  const deleteHandler = (id) => {
    axios.delete(`https://internships-hse.herokuapp.com/internships/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
  };

  const addHandler = (e) => {
    e.preventDefault();
    axios
      .get("https://internships-hse.herokuapp.com/api/students", {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        axios
          .get(
            `https://internships-hse.herokuapp.com/management/api/students/organizations/${response.data.user_id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
              },
            }
          )
          .then((response) => {
            axios.post(
              `https://internships-hse.herokuapp.com/internships?organization_id=${response.data[0].organization_id}`,
              {
                name: name,
                description: description,
                startDate: startDate,
                finishDate: finishDate,
                country: country,
                subject: subject,
                language: language,
                price: price,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("token"),
                },
              }
            );
          })
          .catch((err) => {});
      });
  };

  const toEditHandler = (id) => {
    const editCourse = internships.filter(
      (course) => course.internship_id === id
    );
    setName(editCourse[0].name);
    setDescription(editCourse[0].description);
    setStartDate(editCourse[0].startDate);
    setFinishDate(editCourse[0].finishDate);
    setCountry(editCourse[0].country);
    setSubject(editCourse[0].subject);
    setLanguage(editCourse[0].language);
    setPrice(editCourse[0].price);
    setSelectedId(id);
    setIsEdit(true);
  };

  const editHandler = (e) => {
    e.preventDefault();
    axios
      .put(
        `https://internships-hse.herokuapp.com/internships/${selectedId}`,
        {
          name: name,
          description: description,
          startDate: startDate,
          finishDate: finishDate,
          country: country,
          subject: subject,
          language: language,
          price: price,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then(() => {
        setIsEdit(false);
      })
      .catch((err) => {
        setShowError(true);
      });
  };

  const getReviews = (id) => {
    axios
      .get(`https://internships-hse.herokuapp.com/reviews/internship/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setReviews(response.data);
        setShowReviews(true);
        setShow(true);
      });
  };

  return (
    <>
      {showReviews && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header>
            <Modal.Title>????????????</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {reviews.map((review) => {
              return (
                <div>
                  <h3>
                    {"?????????? "}
                    {review.author.username}
                  </h3>
                  <h3>
                    {"???????????? "} {review.score}
                  </h3>
                  <p>
                    {"?????????????????????? "} {review.textcomment}
                  </p>
                </div>
              );
            })}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              ??????????????
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Container className="mt-3">
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">?????? ??????????</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">???????????????? ?????????? ????????</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  {isEdit ? (
                    <Form>
                      <Alert className={"alert alert-primary "}>
                        ???????????????????????????? ???????????????????? ?? ????????????????????
                      </Alert>

                      {showError && (
                        <Alert
                          variant="danger"
                          onClose={() => setShowError(false)}
                        >
                          <Alert.Heading>????????????!</Alert.Heading>
                          <p>?????????????????? ?????????????????? ????????????.</p>
                          <div className="d-flex justify-content-end">
                            <Button
                              onClick={() => setShowError(false)}
                              variant="success"
                            >
                              ??????????????
                            </Button>
                          </div>
                        </Alert>
                      )}

                      <Form.Group>
                        <Form.Label>????????????????</Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="?????????????????? ????????????????"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                        />
                      </Form.Group>

                      <FormGroup>
                        <Form.Label>????????????????</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="?????????????????? ?????????????????? ????????????????"
                          value={description}
                          onChange={(event) =>
                            setDescription(event.target.value)
                          }
                        />
                      </FormGroup>

                      <Form.Group>
                        <Form.Label>???????? ????????????</Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="?????????????????? ???????? ???????????? ?????????? ?? ?????????????? ????????-????-????"
                          value={startDate}
                          onChange={(event) => setStartDate(event.target.value)}
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>???????? ??????????????????</Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="?????????????????? ???????? ?????????????????? ?????????? ?? ?????????????? ????????-????-????"
                          value={finishDate}
                          onChange={(event) =>
                            setFinishDate(event.target.value)
                          }
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>????????????</Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="?????????????????? ????????????"
                          value={country}
                          onChange={(event) => setCountry(event.target.value)}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>??????????????????????</Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="?????????????????? ???????????????????? ??????????????"
                          value={subject}
                          onChange={(event) => setSubject(event.target.value)}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>????????</Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="?????????????????? ????????"
                          value={language}
                          onChange={(event) => setLanguage(event.target.value)}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>??????????????????</Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="?????????????????? ??????????????????"
                          value={price}
                          onChange={(event) => setPrice(event.target.value)}
                        />
                      </Form.Group>
                      <Button
                        type="submit"
                        className="btn btn-primary mt-2"
                        onClick={editHandler}
                      >
                        ??????????????????
                      </Button>
                    </Form>
                  ) : (
                    <Container>
                      {internships.map((internship) => (
                        <CourseItem
                          key={internship.name}
                          name={internship.name}
                          description={internship.description}
                          startDate={internship.startDate}
                          finishDate={internship.finishDate}
                          country={internship.country}
                          subject={internship.subject}
                          language={internship.language}
                          price={internship.price}
                          score={internship.score}
                          id={internship.internship_id}
                          delete={deleteHandler}
                          toEdit={toEditHandler}
                          onReviews={getReviews}
                        />
                      ))}
                    </Container>
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <Container>
                    <Form>
                      <Alert className={"alert alert-primary "}>
                        ?????????????????? ???????????????????? ?? ????????????????????
                      </Alert>

                      <Form.Group>
                        <Form.Label>????????????????</Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="?????????????????? ????????????????"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                        />
                      </Form.Group>

                      <FormGroup>
                        <Form.Label>????????????????</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="?????????????????? ?????????????????? ????????????????"
                          value={description}
                          onChange={(event) =>
                            setDescription(event.target.value)
                          }
                        />
                      </FormGroup>

                      <Form.Group>
                        <Form.Label>???????? ????????????</Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="?????????????????? ???????? ???????????? ?????????? ?? ?????????????? ????????-????-????"
                          value={startDate}
                          onChange={(event) => setStartDate(event.target.value)}
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>???????? ??????????????????</Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="?????????????????? ???????? ?????????????????? ?????????? ?? ?????????????? ????????-????-????"
                          value={finishDate}
                          onChange={(event) =>
                            setFinishDate(event.target.value)
                          }
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>????????????</Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="?????????????????? ????????????"
                          value={country}
                          onChange={(event) => setCountry(event.target.value)}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>??????????????????????</Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="?????????????????? ???????????????????? ??????????????"
                          value={subject}
                          onChange={(event) => setSubject(event.target.value)}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>????????</Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="?????????????????? ????????"
                          value={language}
                          onChange={(event) => setLanguage(event.target.value)}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>??????????????????</Form.Label>
                        <Form.Control
                          type="text"
                          className="form-control"
                          placeholder="?????????????????? ??????????????????"
                          value={price}
                          onChange={(event) => setPrice(event.target.value)}
                        />
                      </Form.Group>
                      <Button
                        type="submit"
                        className="btn btn-primary mt-2"
                        onClick={addHandler}
                      >
                        ??????????????????
                      </Button>
                    </Form>
                  </Container>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </>
  );
};

export default Courses;
