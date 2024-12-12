import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Test() {
  const [message, setMessage] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("test")
      .then((response) => {
        return response.json();
      })
      .then(function (data) {
        setMessage(data);
      });
  }, []);

  return (
    <div>
      <form method="post" action="/linkchk">
        <span>이름</span>
        <input type="text" name="username" id="username" />
        <br />
        <span>나이</span>
        <input type="text" name="age" id="age" />
        <br />
        <span>다짐</span>
        <input type="text" name="dazim" id="dazim" />
        <br />
        <button>전송</button>
      </form>
      <ul>
        {message.map((text, index) => (
          <li>
            {index + 1}번째 =&gt; {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Test;
