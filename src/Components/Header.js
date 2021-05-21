import React, { useContext } from "react";
import Context from "../context";
import logo from "./logo192.png";
import { Button, Container, Navbar, Nav, Col } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Organization from "../Pages/Organization";
import Courses from "../Pages/Courses";
import Login from "../Pages/Login";
import Register from "../Pages/Registration";
import Profile from "../Pages/Profile";

const Header = () => {
  const { isLogin, setIsLogin } = useContext(Context);

  return (
    <>
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            {isLogin ? (
              <>
                <Nav className="mr-auto">
                  <Nav.Link href="/organization">Организация</Nav.Link>
                  <Nav.Link href="/courses">Курсы</Nav.Link>
                  <Nav.Link href="/profile">Профиль</Nav.Link>
                </Nav>
                <Col className="toggle-nav">
                  <Button
                    variant="warning"
                    className="text-right"
                    href="/login"
                    onClick={() => {
                      setIsLogin(false);
                      localStorage.clear();
                    }}
                  >
                    Выход
                  </Button>
                </Col>
              </>
            ) : (
              <>
                <Nav className="mr-auto">
                  <Nav.Link href="/login">Вход</Nav.Link>
                  <Nav.Link href="/register">Регистрация</Nav.Link>
                </Nav>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route exact path="/organization" component={Organization} />
          <Route exact path="/courses" component={Courses} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </Router>
    </>
  );
};

export default Header;
