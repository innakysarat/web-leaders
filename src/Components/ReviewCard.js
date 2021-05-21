import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ReviewCard = (props) => {
  return (
    <Card className="w-100 text-center border-dark mb-3">
      <Card.Body className="text-dark">
        <Card.Title>{props.name}</Card.Title>
        <Card.Title style={{ fontSize: 15 }}>{props.email}</Card.Title>
        <Card.Text>{props.text}</Card.Text>
        <Card.Text style={{ fontSize: 30, color: "red" }}>
          {props.score}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;
