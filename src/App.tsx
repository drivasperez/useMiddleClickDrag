import "./styles.css";
import React from "react";

function isMiddleClick(ev: MouseEvent) {
  return ev.button === 1;
}

function useMiddleClickDrag() {
  const [ref, setRef] = React.useState<null | HTMLElement>(null);

  React.useEffect(() => {
    const mouseDownListener = (ev: MouseEvent) => {
      console.log("Mouse event:", ev.button);
      if (isMiddleClick(ev)) {
        ev.preventDefault();
      }
    };

    if (ref) {
      ref.addEventListener("mousedown", mouseDownListener);
      return () => {
        ref.removeEventListener("mousedown", mouseDownListener);
      };
    }
  }, [ref]);

  return [setRef];
}

export default function App() {
  const [ref] = useMiddleClickDrag();

  return (
    <div className="App">
      <div
        ref={ref}
        style={{
          overflow: "auto",
          border: "1px solid green",
          width: "400px",
          height: "400px"
        }}
      >
        <div
          style={{
            height: "5000px",
            width: "5000px",
            background:
              "url(https://www.google.com/logos/doodles/2022/hm-queen-elizabeth-ii-6753651837109804.2-s.png)",
            backgroundRepeat: "repeat"
          }}
        ></div>
      </div>
    </div>
  );
}
