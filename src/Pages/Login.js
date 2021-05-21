import React, { useState, useContext } from "react";
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

import { useHistory } from "react-router-dom";

import Context from "../context";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [showError, setShowError] = useState(false);

  const history = useHistory();

  const { setIsLogin } = useContext(Context);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post("https://internships-hse.herokuapp.com/login", {
        username: login,
        password: password,
      })
      .then((response) => {
        localStorage.setItem("token", response.headers.authorization);
        setIsLogin(true);
        history.push("/courses");
      })
      .catch((err) => {
        setShowError(true);
      });
  };

  return (
    <Container className="w-50">
      <Form className={"mt-4"}>
        <Alert className={"alert alert-primary justify-content-md-center "}>
          Вход
        </Alert>
        {showError && (
          <Alert variant="danger" onClose={() => setShowError(false)}>
            <Alert.Heading>Ошибка!</Alert.Heading>
            <p>Проверьте введенные данные.</p>
            <div className="d-flex justify-content-end">
              <Button onClick={() => setShowError(false)} variant="danger">
                Закрыть
              </Button>
            </div>
          </Alert>
        )}
        <Form.Group>
          <Form.Label>Логин</Form.Label>
          <Form.Control
            type="text"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            className="form-control"
            placeholder="Введите ваш логин"
          />
        </Form.Group>
        <FormGroup>
          <Form.Label className="mt-2">Пароль</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="form-control"
            placeholder="Введите пароль"
          />
        </FormGroup>
        <Row className="row justify-content-between mt-2 w-100">
          <Col className="col-4 text-start">
            <Button
              style={{ width: 220 }}
              type="submit"
              className="btn btn-primary mt-2"
              onClick={onSubmitHandler}
            >
              Войти
            </Button>
          </Col>
          <Col className="col-4 text-end">
            <Button
              style={{ width: 220 }}
              type="submit"
              className="btn-secondary mt-2 "
              href="/register"
            >
              Перейти к регистрации
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Login;
