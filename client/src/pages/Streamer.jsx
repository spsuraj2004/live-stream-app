import { useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function Streamer() {
  const videoRef = useRef(null);

  const peerConnection = useRef(null);

  const localStreamRef = useRef(null);

  const [isStreaming, setIsStreaming] =
    useState(false);

  // START STREAM
  const startStreaming = async () => {
    try {
      const localStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      localStreamRef.current =
        localStream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          localStream;
      }

      socket.emit('join-room', 'room1');

      peerConnection.current =
        new RTCPeerConnection();

      localStream
        .getTracks()
        .forEach((track) => {
          peerConnection.current.addTrack(
            track,
            localStream,
          );
        });

      peerConnection.current.onicecandidate =
        (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', {
              roomId: 'room1',
              candidate: event.candidate,
            });
          }
        };

      const offer =
        await peerConnection.current.createOffer();

      await peerConnection.current.setLocalDescription(
        offer,
      );

      socket.emit('offer', {
        roomId: 'room1',
        offer,
      });

      socket.on('answer', async (answer) => {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer),
        );
      });

      socket.on(
        'ice-candidate',
        async (candidate) => {
          try {
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate(candidate),
            );
          } catch (err) {
            console.log(err);
          }
        },
      );

      setIsStreaming(true);
    } catch (error) {
      console.log(error);

      alert(
        'Camera or microphone access denied',
      );
    }
  };

  // END STREAM
  const endStreaming = () => {
    // STOP CAMERA + MIC
    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
    }

    // CLOSE PEER CONNECTION
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    // REMOVE VIDEO
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-500">
              Streamer Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              Live broadcasting panel
            </p>
          </div>

          {isStreaming && (
            <div className="flex items-center gap-2 bg-red-500 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>

              <span className="font-semibold">
                LIVE
              </span>
            </div>
          )}
        </div>

        {/* VIDEO PANEL */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-2xl"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={startStreaming}
            disabled={isStreaming}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-700 px-6 py-3 rounded-xl font-semibold"
          >
            Start Stream
          </button>

          <button
            onClick={endStreaming}
            disabled={!isStreaming}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-700 px-6 py-3 rounded-xl font-semibold"
          >
            End Stream
          </button>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-2">
              Stream Status
            </h2>

            <p
              className={
                isStreaming
                  ? 'text-green-400'
                  : 'text-red-400'
              }
            >
              {isStreaming
                ? 'Broadcasting Active'
                : 'Stream Offline'}
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-2">
              Resolution
            </h2>

            <p className="text-gray-300">
              1280 × 720 HD
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-2">
              Audio
            </h2>

            <p className="text-gray-300">
              Microphone Connected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Streamer;