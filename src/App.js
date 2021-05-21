import { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Context from "./context";

import Header from "./Components/Header";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <Context.Provider value={{ isLogin, setIsLogin }}>
      <div>
        <Header isLogin={isLogin} />
      </div>
    </Context.Provider>
  );
};

export default App;
