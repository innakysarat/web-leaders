import { Button, Card, ButtonGroup } from "react-bootstrap";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function MyDropzone(id) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("image", file);
      axios.post(
        `https://internships-hse.herokuapp.com/internships/${id.id}/image`,
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
        <p>Отпустите клавишу для сохранения ...</p>
      ) : (
        <p>
          Перетащите файл изображения в красную область загрузки или нажмите для
          открытия меню выбора
        </p>
      )}
    </div>
  );
}

const CourseItem = (props) => {
  const id = props.id;
  return (
    <Card bg={"light"} className="w-100 text-center border-dark mb-3">
      <Card.Body className="text-dark">
        <Card.Title>{props.name}</Card.Title>
        <img
          src={`https://internships-hse.herokuapp.com/internships/${id}/image`}
          alt="new"
          style={{ maxHeight: 190 }}
        />
        <Card.Text>{props.description}</Card.Text>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <div>
            <Card.Subtitle>Дата начала:</Card.Subtitle>
            <Card.Text>{props.startDate}</Card.Text>
          </div>
          <div>
            <Card.Subtitle>Дата окончания:</Card.Subtitle>
            <Card.Text>{props.finishDate}</Card.Text>
          </div>
          <div>
            <Card.Subtitle>Страна:</Card.Subtitle>
            <Card.Text>{props.country}</Card.Text>
          </div>
          <div>
            <Card.Subtitle>Направление:</Card.Subtitle>
            <Card.Text>{props.subject}</Card.Text>
          </div>
          <div>
            <Card.Subtitle>Язык:</Card.Subtitle>
            <Card.Text>{props.language}</Card.Text>
          </div>
          <div>
            <Card.Subtitle>Стоимость:</Card.Subtitle>
            <Card.Text>{props.price}$</Card.Text>
          </div>
          <div>
            <Card.Subtitle>Оценка:</Card.Subtitle>
            <Card.Text>
              {props.score === "NaN" ? "" : props.score.toFixed(2)}
            </Card.Text>
          </div>
        </div>
        <ButtonGroup>
          <Button
            variant="btn btn-outline-primary"
            onClick={() => props.toEdit(id)}
          >
            Изменить
          </Button>
          <Button
            variant="btn btn-outline-primary"
            onClick={() => props.delete(id)}
          >
            Удалить
          </Button>
          <Button
            variant="btn btn-outline-primary"
            onClick={() => props.onReviews(id)}
          >
            Отзывы
          </Button>
        </ButtonGroup>
        <MyDropzone id={id} />
      </Card.Body>
    </Card>
  );
};

export default CourseItem;
