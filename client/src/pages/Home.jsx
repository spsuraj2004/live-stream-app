import axios from 'axios';

function Home() {
  const startStream = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:3000/streams/start',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      alert('Stream started successfully');
    } catch (error) {
      console.log(error);

      alert('Failed to start stream');
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h1>Streaming Dashboard</h1>

      <button onClick={startStream}>
        Start Stream
      </button>
    </div>
  );
}

export default Home;