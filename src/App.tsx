import "./styles.css";
import React from "react";

interface ScrollState {
  left: number;
  top: number;
  x: number;
  y: number;
}

function useMiddleClickDrag() {
  const [ref, setRef] = React.useState<null | HTMLElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const posRef = React.useRef<ScrollState>({ top: 0, left: 0, x: 0, y: 0 });

  React.useEffect(() => {
    if (ref) {
      // When the user middle clicks, record current scroll position and track
      // mousemove and mouseup events on window.
      const mouseDownListener = (ev: MouseEvent) => {
        if (isMiddleClick(ev)) {
          setIsDragging(true);
          posRef.current = {
            left: ref.scrollLeft,
            top: ref.scrollTop,
            x: ev.clientX,
            y: ev.clientY,
          };
          window.addEventListener("mousemove", mouseMoveListener);
          // document.addEventListener("mouseenter", mouseEnterListener);
          window.addEventListener("mouseup", mouseUpListener);
        }
      };

      // If the middle mouse button is held, scroll the container on mousemove.
      const mouseMoveListener = (ev: MouseEvent) => {
        const { clientX, clientY } = ev;
        const dx = clientX - posRef.current.x;
        const dy = clientY - posRef.current.y;

        ref.scrollLeft = posRef.current.left - dx;
        ref.scrollTop = posRef.current.top - dy;
      };

      // If the mouse enters the window and middle button is not held, that means
      // the user stopped middle clicking outside of the window, which the mouseUpListener
      // will not catch. So stop the dragging.
      const mouseEnterListener = (ev: MouseEvent) => {
        if (!hasMiddleClickHeld(ev)) {
          setIsDragging(false);
          window.removeEventListener("mousemove", mouseMoveListener);
          window.removeEventListener("mouseup", mouseUpListener);
        }
      };

      // If the user stops holding the middle mouse button, remove the event listeners.
      const mouseUpListener = (ev: MouseEvent) => {
        if (isMiddleClick(ev)) {
          setIsDragging(false);
          window.removeEventListener("mouseup", mouseUpListener);
          window.removeEventListener("mousemove", mouseMoveListener);
          window.removeEventListener("mouseenter", mouseEnterListener);
        }
      };

      ref.addEventListener("mousedown", mouseDownListener);
      return () => {
        // Remove all the event listeners just in case.
        ref.removeEventListener("mousedown", mouseDownListener);
        window.removeEventListener("mousemove", mouseMoveListener);
        window.removeEventListener("mouseenter", mouseEnterListener);
        window.removeEventListener("mouseup", mouseUpListener);
      };
    }
  }, [ref]);

  return [setRef, isDragging] as const;
}

export default function App() {
  const [ref, isDragging] = useMiddleClickDrag();

  return (
    <div
      className="App"
      style={{ cursor: isDragging ? "all-scroll" : "default" }}
    >
      <div
        ref={ref}
        style={{
          overflow: "auto",
          border: "1px solid green",
          width: "400px",
          height: "400px",
        }}
      >
        <div
          style={{
            height: "5000px",
            width: "5000px",
            background:
              "url(https://www.google.com/logos/doodles/2022/hm-queen-elizabeth-ii-6753651837109804.2-s.png)",
            backgroundRepeat: "repeat",
          }}
        ></div>
      </div>
    </div>
  );
}

function isMiddleClick(ev: MouseEvent) {
  return ev.button === 1;
}

function hasMiddleClickHeld(ev: MouseEvent) {
  return ev.buttons === 4;
}
