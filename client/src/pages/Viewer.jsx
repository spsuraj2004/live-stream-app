import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function Viewer() {
  const videoRef = useRef(null);

  const peerConnection = useRef(null);

  const [joined, setJoined] = useState(false);

  const [messages, setMessages] = useState([]);

  const [message, setMessage] =
    useState('');

  const [streamEnded, setStreamEnded] =
    useState(false);

  // SOCKET LISTENERS
  useEffect(() => {
    // OFFER
    socket.on(
      'offer',
      async (offer) => {
        try {
          peerConnection.current =
            new RTCPeerConnection();

          // RECEIVE STREAM
          peerConnection.current.ontrack =
            (event) => {
              videoRef.current.srcObject =
                event.streams[0];
            };

          // ICE
          peerConnection.current.onicecandidate =
            (event) => {
              if (event.candidate) {
                socket.emit(
                  'ice-candidate',
                  {
                    roomId: 'room1',
                    candidate:
                      event.candidate,
                  },
                );
              }
            };

          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(
              offer,
            ),
          );

          const answer =
            await peerConnection.current.createAnswer();

          await peerConnection.current.setLocalDescription(
            answer,
          );

          socket.emit('answer', {
            roomId: 'room1',
            answer,
          });
        } catch (err) {
          console.log(err);
        }
      },
    );

    // ICE RECEIVE
    socket.on(
      'ice-candidate',
      async (candidate) => {
        try {
          if (
            peerConnection.current
          ) {
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate(
                candidate,
              ),
            );
          }
        } catch (err) {
          console.log(err);
        }
      },
    );

    // CHAT
    socket.on(
      'chat-message',
      (data) => {
        setMessages((prev) => [
          ...prev,
          data,
        ]);
      },
    );

    // STREAM ENDED
    socket.on('stream-ended', () => {
      setStreamEnded(true);

      setJoined(false);

      setMessages([]);

      if (videoRef.current) {
        videoRef.current.srcObject =
          null;
      }
    });

    return () => {
      socket.off('offer');
      socket.off('ice-candidate');
      socket.off('chat-message');
      socket.off('stream-ended');
    };
  }, []);

  // JOIN STREAM
  const joinStream = () => {
    setStreamEnded(false);

    socket.emit('join-room', 'room1');

    socket.emit('viewer-joined');

    setJoined(true);
  };

  // SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit('chat-message', {
      roomId: 'room1',
      sender: 'Viewer',
      message,
    });

    setMessage('');
  };

  // ENTER KEY
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white p-10">
      <h1 className="text-6xl font-bold text-blue-500 mb-8">
        Viewer Dashboard
      </h1>

      {!joined && (
        <button
          onClick={joinStream}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl text-xl font-bold mb-8"
        >
          Join Stream
        </button>
      )}

      {streamEnded && (
        <div className="bg-red-900 border border-red-500 text-red-300 p-6 rounded-2xl mb-8 text-2xl font-bold">
          Livestream Ended By The
          Streamer
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        controls
        className="w-full max-w-5xl rounded-3xl border border-gray-700 mb-10 bg-black"
      />

      {joined && !streamEnded && (
        <div className="bg-gray-900 p-6 rounded-3xl max-w-2xl border border-gray-700">
          <h2 className="text-3xl font-bold mb-6">
            Live Chat
          </h2>

          <div className="bg-gray-800 rounded-2xl h-[300px] overflow-y-auto p-4 mb-5">
            {messages.length === 0 ? (
              <p className="text-gray-400">
                No messages yet...
              </p>
            ) : (
              messages.map(
                (msg, index) => (
                  <div
                    key={index}
                    className="mb-3"
                  >
                    <span className="font-bold text-blue-400">
                      {
                        msg.sender
                      }
                      :
                    </span>{' '}
                    {msg.message}
                  </div>
                ),
              )
            )}
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value,
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder="Type message..."
              className="flex-1 bg-gray-800 p-4 rounded-2xl outline-none"
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 px-6 rounded-2xl font-bold"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Viewer;