import axios from "axios";

const digipayApiConfig = {
  "X-API-ID": "zy71MTcREXdbRG5o2j0bXSvoxs2UhM8XU3hAf9FqCY8",
  "X-API-KEY": "YOBC31ap_0M39r0HENkhHV--Vkq3NrZxTIo-3hiOohk",
  "X-Partner-ID": "1656310838",
};

const UrlBase = "https://octopus-unify.digipay.dev";

async function verifySlip(code) {
  try {
    const ax = axios.create({
      baseURL: UrlBase,
      headers: {
        ...digipayApiConfig,
        "Content-Type": "application/json",
      },
    });

    const res = await ax.post("/v2/transaction/verify/slip", {
      miniqr: code,
    });

    console.log(res.data);
    return res.data;
  } catch (err) {
    console.log(JSON.stringify(err));
    alert(JSON.stringify(err));
  }
}

// let code = "0046000600000101030140225202106095oz38fDh6iqgcSYU75102TH9104FFD7";
// verifySlip(code);
export default verifySlip;
