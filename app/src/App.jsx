import { useState } from "react";
// import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import Form from "./Form";
import Items from "./Items";

function App() {
  const [data, setData] = useState(0);

  const GetData = () => {
    setData(data + 1);
  };

  return (
    <div className="App">
      <Navbar />
      <div className="main__container p-0">
        <div className="main__wrapper container">
          <div className="row justify-content-start">
            <div className=" col-6 border bg-white rounded shadow mt-5 p-3 ms-2">
              <Form
                GetData={GetData}
              />
            </div>
          </div>
          {/* items */}
          <Items 
            data={data}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
