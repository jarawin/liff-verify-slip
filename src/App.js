import React, { useRef, useEffect, useState } from "react";
import liff from "@line/liff";
import jsQR from "jsqr";
import beep from "./sound/scanner-beeps-barcode.mp3";

import { MdFlipCameraAndroid } from "react-icons/md";
import { IoScanCircle } from "react-icons/io5";

import verifySlip from "./apis/digiPayVerifySlip";

const Liff_id = "1661100849-eWb65oJp";

const QRScanner = () => {
  const [pictureUrl, setPictureUrl] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [userId, setUserId] = useState("");

  const initLine = async () => {
    await liff.init(
      { liffId: Liff_id },
      async () => {
        if (liff.isLoggedIn()) {
          await runApp();
        } else {
          liff.login();
        }
      },
      (err) => console.error(err)
    );
  };

  const saveProfile = (profile) => {
    setPictureUrl(profile.pictureUrl);
    setDisplayName(profile.displayName);
    setStatusMessage(profile.statusMessage);
    setUserId(profile.userId);

    localStorage.setItem("pictureUrl", profile.pictureUrl);
    localStorage.setItem("displayName", profile.displayName);
    localStorage.setItem("statusMessage", profile.statusMessage);
    localStorage.setItem("userId", profile.userId);
  };

  const runApp = async () => {
    try {
      const profile = await liff.getProfile();
      saveProfile(profile);
    } catch (err) {
      console.error(err);
    }
  };

  const [audio] = useState(new Audio(beep));
  const [textResult, setTextResult] = useState("");
  const [displayText, setDisplayText] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedCamera, setSelectedCamera] = useState(0);

  useEffect(() => {
    // initLine();
    handleDecode();
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        if (videoDevices.length === 0) {
          alert("No video input devices found.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: {
              exact: videoDevices[selectedCamera].deviceId,
            },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        alert(`Error accessing camera: ${error}`);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedCamera]);

  const handleDecode = async () => {
    if (canvasRef.current && videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setTimeout(handleDecode, 200);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      if (!imageData) {
        setTimeout(handleDecode, 200);
        return;
      }

      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        audio.play();
        setTextResult("Found ✓");
        await verifySlip(code.data);

        setTimeout(handleDecode, 200);
      } else {
        setTextResult("Not found ✗");
        setTimeout(handleDecode, 200);
      }
    }
  };

  useEffect(() => {
    if (textResult) {
      setTimeout(() => {
        setTextResult("");
      }, 100);
    }
  }, [textResult]);

  const handleCameraSwitch = () => {
    setSelectedCamera((prevCamera) => (prevCamera === 0 ? 1 : 0));
  };

  return (
    <div className="fixed top-0 left-0 ">
      {textResult && (
        <div className="absolute top-0 left-0  ml-2 mt-2  mx-5 my-2">
          <p className="text-white rounded-full">{textResult}</p>
        </div>
      )}
      <button
        onClick={handleCameraSwitch}
        type="button"
        className="absolute top-0 right-0  mt-2 mr-2  rounded-full w-10 h-10"
      >
        {/* SWAP */}
        <MdFlipCameraAndroid className="w-8 h-8 mb-1 text-white group-hover:text-blue-600 " />
      </button>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full "
      ></video>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <button
        onClick={handleDecode}
        type="button"
        className="absolute bottom-0 left-1/2 -translate-x-1/2  mt-2 mr-2  rounded-full w-14 h-14"
      >
        {/* SCANER */}
        <IoScanCircle className="w-14 h-14 mb-1 text-white group-hover:text-blue-600 " />
      </button>

      {displayName && (
        <div className="absolute bottom-0 right-0  mr-2 mb-2  mx-5 my-2">
          <p className="text-white rounded-full animate-pulse">{displayName}</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
