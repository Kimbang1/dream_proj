import React from "react";
import { useEffect, useState } from "react";


function Res() {
    const [dataList, setDataList] = useState([]);
    
      useEffect(() => {
        fetch("select")
          .then((response) => {
            return response.json();
          })
          .then(function (data) {
            setDataList(data);
          })
          .catch((error) => console.error("Error fetching data: ", error))
      }, []);
    
      return (
        <div>
          <h1>DB data</h1>
          <ul>
            {dataList.map((list, index) => (
              <li key={index}>
                <p>
                    이름: {list.username} &nbsp;&nbsp;
                    나이: {list.age} &nbsp;&nbsp;
                    다짐: {list.dazim}
                </p>
              </li>
            ))}
          </ul>
        </div>
      );
}

export default Res;