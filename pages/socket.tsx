import { useEffect, useState } from 'react';
import io from 'socket.io-client';
let socket;

const SocketPage = () => {
  const [input, setInput] = useState('');

  const onChangeHandler = (e) => {
    setInput(e.target.value);
    socket.emit('input-change', e.target.value);
  };

  useEffect(() => {
    fetch('/api/socket');
    if (process.env.NODE_ENV === 'development') {
      socket = io('http://localhost:3000');
    }
    if (process.env.NODE_ENV === 'production') {
      socket = io('https://portaal-super-turg.vercel.app');
    }
    socket.on('connect', () => {
      console.log('CONNECTED');
    });
    socket.on('poop', () => {
      console.log('poop');
    });
    socket.on('update-input', (msg) => {
      console.log(msg);
      setInput(msg);
    });
  }, []);

  return (
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  );
};

export default SocketPage;
