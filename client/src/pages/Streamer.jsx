import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function Streamer() {
  const videoRef = useRef(null);

  const peerConnection = useRef(null);

  const localStreamRef = useRef(null);

  const [isStreaming, setIsStreaming] =
    useState(false);

  const [messages, setMessages] = useState([]);

  const [message, setMessage] =
    useState('');

  // START STREAM
  const startStream = async () => {
    try {
      const localStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      localStreamRef.current =
        localStream;

      videoRef.current.srcObject =
        localStream;

      socket.emit('join-room', 'room1');

      setIsStreaming(true);
    } catch (error) {
      console.log(error);
    }
  };

  // VIEWER JOINED
  useEffect(() => {
    socket.on(
      'viewer-joined',
      async () => {
        if (
          !localStreamRef.current
        )
          return;

        // CLOSE OLD CONNECTION
        if (
          peerConnection.current
        ) {
          peerConnection.current.close();
        }

        peerConnection.current =
          new RTCPeerConnection();

        // ADD TRACKS
        localStreamRef.current
          .getTracks()
          .forEach((track) => {
            peerConnection.current.addTrack(
              track,
              localStreamRef.current,
            );
          });

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

        // CREATE OFFER
        const offer =
          await peerConnection.current.createOffer();

        await peerConnection.current.setLocalDescription(
          offer,
        );

        socket.emit('offer', {
          roomId: 'room1',
          offer,
        });
      },
    );

    // ANSWER
    socket.on(
      'answer',
      async (answer) => {
        try {
          if (
            peerConnection.current
          ) {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(
                answer,
              ),
            );
          }
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
        setMessages((prev) => {
          return [...prev, data];
        });
      },
    );

    return () => {
      socket.off('viewer-joined');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('chat-message');
    };
  }, []);

  // END STREAM
  const endStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop(),
        );
    }

    if (peerConnection.current) {
      peerConnection.current.close();
    }

    videoRef.current.srcObject = null;

    setIsStreaming(false);

    setMessages([]);

    socket.emit('stream-ended');
  };

  // SEND MESSAGE
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit('chat-message', {
      roomId: 'room1',
      sender: 'Streamer',
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
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-6xl font-bold text-red-500">
          Streamer Dashboard
        </h1>

        {!isStreaming ? (
          <button
            onClick={startStream}
            className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-2xl text-xl font-bold"
          >
            Start Stream
          </button>
        ) : (
          <button
            onClick={endStream}
            className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-2xl text-xl font-bold"
          >
            End Stream
          </button>
        )}
      </div>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full max-w-5xl rounded-3xl border border-gray-700 mb-10"
      />

      {isStreaming && (
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
                    <span className="font-bold text-red-400">
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
              className="bg-red-600 hover:bg-red-700 px-6 rounded-2xl font-bold"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Streamer;