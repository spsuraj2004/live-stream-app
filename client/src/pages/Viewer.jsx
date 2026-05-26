import { useState } from 'react';

function Viewer() {
  const [streams] = useState([
    {
      id: 1,
      title: 'Suraj Live Stream',
      streamer: 'S P Suraj',
    },
  ]);

  const joinStream = () => {
    alert('Joining livestream...');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold text-red-500 mb-8">
        Viewer Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {streams.map((stream) => (
          <div
            key={stream.id}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold mb-2">
              {stream.title}
            </h2>

            <p className="text-gray-400 mb-4">
              Streamer: {stream.streamer}
            </p>

            <button
              onClick={joinStream}
              className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-semibold"
            >
              Join Stream
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Viewer;