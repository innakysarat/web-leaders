import {
  Button,
  Card,
  Row,
  Col,
  ButtonGroup,
  Form,
  Alert,
} from "react-bootstrap";
import React, { useState, useContext, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

import Context from "../context";

function MyDropzone(id) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("file", file);
      axios.post(
        `https://internships-hse.herokuapp.com/api/students/${id.id}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
    },
    [id.id]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        width: "100%",
        height: 90,
        borderColor: "red",
        backgroundColor: "#DAA",
        marginTop: 15,
        borderRadius: 8,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <input {...getInputProps()} />

      {isDragActive ? (
        <p>Отпустите кнопку для сохранения ...</p>
      ) : (
        <p>
          Перетащите файл изображения в красную область загрузки или нажмите для
          открытия меню выбора
        </p>
      )}
    </div>
  );
}

const Profile = (props) => {
  const { setIsLogin } = useContext(Context);
  const [user, setUser] = useState();
  const [isEdit, setIsEdit] = useState(false);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dayOfBirth, setDayOfBirth] = useState("");

  const [showError, setShowError] = useState(false);

  const toEditHandler = () => {
    setName(user.name);
    setSurname(user.surname);
    setPatronymic(user.patronymic);
    setEmail(user.email);
    setPhone(user.phone);
    setDayOfBirth(user.dayOfBirth);
    setIsEdit(true);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();

    axios
      .put(
        `https://internships-hse.herokuapp.com/api/students/${user.user_id}`,
        {
          name: name,
          surname: surname,
          patronymic: patronymic,
          email: email,
          phone: phone,
          dayOfBirth: dayOfBirth,
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
        setUser(response.data);
      });
  }, [setIsLogin]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 15,
      }}
    >
      {isEdit ? (
        <>
          <Form style={{ width: "50%" }}>
            <Alert className={"alert alert-primary"}>
              Редактирование профиля
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
              <Form.Label className="mt-2">Имя</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Введите ваше имя"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="mt-2">Фамилия</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Введите вашу фамилию"
                value={surname}
                onChange={(event) => setSurname(event.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="mt-2">Отчество</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Введите ваше отчество"
                value={patronymic}
                onChange={(event) => setPatronymic(event.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="mt-2">E-mail</Form.Label>
              <Form.Control
                type="e-mail"
                className="form-control"
                placeholder="Введите ваш адрес электронной почты"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="mt-2">Телефон</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Введите ваш телефон"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="mt-2">Дата рождения</Form.Label>
              <Form.Control
                type="date"
                className="form-control"
                placeholder="Введите ваш телефон"
                value={dayOfBirth}
                onChange={(event) => setDayOfBirth(event.target.value)}
              />
            </Form.Group>

            <Row className="row justify-content-between mt-2 w-100">
              <Col className="col-4 text-start">
                <Button
                  style={{ width: 220 }}
                  type="submit"
                  className="btn btn-primary mt-2 "
                  onClick={onSubmitHandler}
                >
                  Сохранить изменения
                </Button>
              </Col>
            </Row>
          </Form>
        </>
      ) : (
        <Card bg={"light"} className="w-50 text-center border-dark mb-3">
          <Card.Body className="text-dark">
            {user && (
              <>
                <Card.Title>{user.username}</Card.Title>
                <Card.Subtitle>
                  {user.surname} {user.name} {user.patronymic}
                </Card.Subtitle>

                {user && (
                  <img
                    src={`https://internships-hse.herokuapp.com/api/students/${user.user_id}/image`}
                    alt="new"
                    style={{ maxHeight: 190 }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 15,
                    marginTop: 15,
                  }}
                >
                  <div>
                    <Card.Subtitle>Дата рождения:</Card.Subtitle>
                    <Card.Text>{user.dayOfBirth}</Card.Text>
                  </div>
                  <div>
                    <Card.Subtitle>E-mail:</Card.Subtitle>
                    <Card.Text>{user.email}</Card.Text>
                  </div>
                  <div>
                    <Card.Subtitle>Телефон:</Card.Subtitle>
                    <Card.Text>{user.phone}</Card.Text>
                  </div>
                </div>
                <ButtonGroup>
                  <Button
                    variant="btn btn-outline-primary"
                    onClick={() => toEditHandler()}
                  >
                    Изменить
                  </Button>
                </ButtonGroup>
                <MyDropzone id={user.user_id} />
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Profile;
