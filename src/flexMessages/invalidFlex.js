export default function genInvalidFlex(miniqr) {
  return {
    type: "flex",
    altText: "invalid message",
    contents: {
      type: "bubble",
      size: "mega",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "Not found ✗",
            weight: "bold",
            color: "#D2042D",
            size: "xl",
          },
          {
            type: "separator",
            margin: "sm",
          },
          {
            type: "box",
            layout: "horizontal",
            margin: "md",
            contents: [
              {
                type: "text",
                text: "Mini QR.",
                size: "xs",
                color: "#aaaaaa",
                flex: 0,
              },
              {
                type: "text",
                text: `#${miniqr}`,
                color: "#aaaaaa",
                size: "xs",
                align: "end",
                offsetStart: "10px",
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
