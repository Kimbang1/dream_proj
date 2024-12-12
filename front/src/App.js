import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState([]);

  useEffect( () => {
    fetch("test").then((response) => {
      return response.json();
    })
    .then(function (data) {
      setMessage(data);
    });
  }, []);

  return (
    <div>
      <img src={logo} className='App-logo' alt="logo" />
      <ul>
        {message.map((text, index) => <li>{index+1}번째 =&gt; {text}</li>)}
      </ul>
    </div>
  );
}

export default App;
