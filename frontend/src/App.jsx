import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("http://localhost:5000/generate");
      const data = await response.json();
      console.log(response);
      if (response.ok) {
        setData(data);
        console.log(data);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <img src={`data:image/jpeg;base64,${data["message"]}`} />
    </div>
  );
}

export default App;
