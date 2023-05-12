const formateTime = (transTime) => {
  const date = new Date(`1970-01-01T${transTime}Z`);
  return date.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour12: true,
  });
};

const formateDate = (transDate) => {
  const year = transDate.slice(0, 4);
  const month = new Date(
    `${transDate.slice(0, 4)}-${transDate.slice(4, 6)}-${transDate.slice(
      6,
      8
    )}T00:00:00Z`
  ).toLocaleString("en-US", { month: "short" });
  const day = parseInt(transDate.slice(6, 8), 10);
  return `${day} ${month} ${year}`;
};

export default function genCorrectFlex(
  amount,
  sender,
  bankSender,
  receiver,
  bankReceiver,
  transRef,
  transDate,
  transTime
) {
  transTime = formateTime(transTime);
  transDate = formateDate(transDate);

  return {
    type: "flex",
    altText: "correct message",
    contents: {
      type: "bubble",
      size: "mega",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `Received ${amount}฿ ✓`,
            weight: "bold",
            color: "#1DB446",
            size: "xl",
          },
          {
            type: "text",
            text: `${transTime}, ${transDate}`,
            size: "xs",
            color: "#aaaaaa",
            wrap: true,
          },
          {
            type: "separator",
            margin: "xxl",
          },
          {
            type: "box",
            layout: "vertical",
            margin: "xxl",
            spacing: "sm",
            contents: [
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "From",
                    size: "sm",
                    color: "#555555",
                    flex: 0,
                    weight: "bold",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "Sender name",
                    size: "sm",
                    color: "#555555",
                    flex: 0,
                  },
                  {
                    type: "text",
                    text: `${sender}`,
                    size: "sm",
                    color: "#111111",
                    align: "end",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "Bank account",
                    size: "sm",
                    color: "#555555",
                    flex: 0,
                  },
                  {
                    type: "text",
                    text: `${bankSender}`,
                    size: "sm",
                    color: "#111111",
                    align: "end",
                  },
                ],
              },
              {
                type: "separator",
                margin: "xxl",
              },
              {
                type: "box",
                layout: "horizontal",
                margin: "xxl",
                contents: [
                  {
                    type: "text",
                    text: "To",
                    size: "sm",
                    color: "#555555",
                    weight: "bold",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    size: "sm",
                    color: "#555555",
                    text: "Receiver name",
                  },
                  {
                    type: "text",
                    text: `${receiver}`,
                    size: "sm",
                    color: "#111111",
                    align: "end",
                  },
                ],
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "Bank account",
                    size: "sm",
                    color: "#555555",
                  },
                  {
                    type: "text",
                    text: `${bankReceiver}`,
                    size: "sm",
                    color: "#111111",
                    align: "end",
                  },
                ],
              },
            ],
          },
          {
            type: "separator",
            margin: "xxl",
          },
          {
            type: "box",
            layout: "horizontal",
            margin: "md",
            contents: [
              {
                type: "text",
                text: "Transfer Ref.",
                size: "xs",
                color: "#aaaaaa",
                flex: 0,
              },
              {
                type: "text",
                text: `#${transRef}`,
                color: "#aaaaaa",
                size: "xs",
                align: "end",
              },
            ],
          },
        ],
        position: "relative",
      },
      styles: {
        footer: {
          separator: true,
        },
      },
    },
  };
}
