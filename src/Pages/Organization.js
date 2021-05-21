import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Container,
  Form,
  FormGroup,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

import Context from "../context";

const Organization = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [organization, setOrganization] = useState();

  const { setIsLogin } = useContext(Context);

  const [showError, setShowError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
            if (response.data[0]) {
              setName(response.data[0].name);
              setDescription(response.data[0].description);
              setReference(response.data[0].reference);
              setOrganization(response.data[0]);
            }
          });
      });
  }, [setIsLogin]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (organization) {
      axios
        .put(
          `https://internships-hse.herokuapp.com/organizations/${organization.organization_id}`,
          {
            name: name,
            description: description,
            reference: reference,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then(() => {
          setShowConfirm(true);
          setShowError(false);
        })
        .catch(() => {
          setShowError(true);
          setShowConfirm(false);
        });
    } else {
      axios
        .post(
          `https://internships-hse.herokuapp.com/organizations`,
          {
            name: name,
            description: description,
            reference: reference,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then(() => {
          setShowConfirm(true);
          setShowError(false);
        })
        .catch(() => {
          setShowError(true);
          setShowConfirm(false);
        });
    }
  };

  const onDeleteHandler = (e) => {
    e.preventDefault();
    if (organization) {
      axios
        .delete(
          `https://internships-hse.herokuapp.com/organizations/${organization.organization_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then(() => {
          setShowConfirm(true);
          setShowError(false);
          setName("");
          setReference("");
          setDescription("");
          setOrganization(undefined);
        })
        .catch(() => {
          setShowError(true);
          setShowConfirm(false);
        });
    }
  };

  return (
    <Container className="w-50">
      <Form className={"mt-4"}>
        <Alert className={"alert alert-primary "}>
          Информация об организации
        </Alert>
        {showError && (
          <Alert variant="danger" onClose={() => setShowError(false)}>
            <Alert.Heading>Ошибка!</Alert.Heading>
            <p>Проверьте введенные данные.</p>
            <div className="d-flex justify-content-end">
              <Button onClick={() => setShowError(false)} variant="success">
                Закрыть
              </Button>
            </div>
          </Alert>
        )}
        {showConfirm && (
          <Alert variant="success" onClose={() => setShowConfirm(false)}>
            <Alert.Heading>Успешно!</Alert.Heading>
            <p>Данные успешно сохранены.</p>
            <div className="d-flex justify-content-end">
              <Button onClick={() => setShowConfirm(false)} variant="success">
                Закрыть
              </Button>
            </div>
          </Alert>
        )}

        <Form.Group>
          <Form.Label>Название</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="form-control"
            placeholder="Введите название"
          />
        </Form.Group>

        <FormGroup>
          <Form.Label className="mt-2">Описание</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="form-control "
            placeholder="Заполните описание "
          />
        </FormGroup>

        <Form.Group>
          <Form.Label className="mt-2">Сайт</Form.Label>
          <Form.Control
            type="text"
            rows="3"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            className="form-control"
            placeholder="Введите ваш логин"
          />
        </Form.Group>
        <Row className="row justify-content-between mt-2 w-100">
          <Col className="col-4 text-start">
            <Button
              style={{ width: 220 }}
              type="submit"
              className="btn btn-primary mt-2"
              onClick={onSubmitHandler}
            >
              Сохранить
            </Button>
          </Col>
          <Col className="col-4 text-end">
            <Button
              style={{ width: 220 }}
              type="submit"
              className="btn-secondary mt-2 "
              onClick={onDeleteHandler}
            >
              Удалить
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Organization;
