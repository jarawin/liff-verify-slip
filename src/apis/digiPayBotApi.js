import axios from "axios";

const UrlBase = "https://4fcdab732bd7f1.lhr.life";

async function verifySlip(code, userid) {
  try {
    const ax = axios.create({
      baseURL: UrlBase,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await ax.post("/api/verifyslip", {
      userid: userid,
      miniqr: code,
    });

    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(err);
    alert(JSON.stringify(err));
  }
}

export default verifySlip;
