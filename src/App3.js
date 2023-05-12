import React, { useRef, useEffect, useState } from "react";
import { createCanvas, loadImage } from "canvas";
import axios from "axios";
import liff from "@line/liff";
import jsQR from "jsqr";
import Webcam from "react-webcam";

const Liff_id = "1661100849-eWb65oJp";

const QRCodeScanner = () => {
  const [selectedCamera, setSelectedCamera] = useState(0);
  const webcamRef = useRef(null);

  const verifyMiniqr = async (miniqr) => {
    const BaseUrl = "https://25808165022347.lhr.life";

    const res = await axios.post(`${BaseUrl}/api/verifyslip`, {
      miniqr,
      userId,
    });

    if (res.status == 200) {
      if (liff.isInClient()) {
        liff.closeWindow();
      } else {
        alert("ยืนยันสำเร็จ");
      }
    } else {
      alert("ยืนยันไม่สำเร็จ");
    }
  };

  const handleCode = (code) => {
    if (liff.isInClient()) {
      liff.sendMessages([
        {
          type: "text",
          text: code,
        },
      ]);
    } else {
      console.log(code);
    }

    verifyMiniqr(code);
    console.log(code);
  };

  const captureFrame = async () => {
    const canvas = createCanvas();
    const imageSrc = webcamRef.current.getScreenshot();
    const image = await loadImage(imageSrc);
    canvas.width = image.width;
    canvas.height = image.height;

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      handleCode(code.data);
    }
  };

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

  useEffect(() => {
    // initLine();
    const interval = setInterval(captureFrame, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCameraSwitch = () => {
    setSelectedCamera((prevCamera) => (prevCamera === 0 ? 1 : 0));
  };

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{
          width: `100%`,
          height: `100%`,
          position: "fixed",
        }}
      />
      <button onClick={handleCameraSwitch}>Switch Camera</button>
    </div>
  );
};

export default QRCodeScanner;
