import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { appWindow, LogicalSize } from "@tauri-apps/api/window";

// const elementSizeDeps = (element: HTMLElement | undefined | null) => {
//   const { width = 0, height = 0 } = element?.getBoundingClientRect() ?? {};
//   return [
//     width,
//     element?.scrollWidth,
//     element?.offsetWidth,
//     element?.clientWidth,
//     height,
//     element?.scrollHeight,
//     element?.offsetHeight,
//     element?.clientHeight,
//   ];
// };

export const getElementSize = (element: HTMLElement | undefined | null) => {
  const { width: rectWidth = 0, height: rectHeight = 0 } =
    element?.getBoundingClientRect() ?? {};

  const {
    scrollWidth = 0,
    offsetWidth = 0,
    clientWidth = 0,
    scrollHeight = 0,
    offsetHeight = 0,
    clientHeight = 0,
  } = element ?? {};

  return [
    Math.max(rectWidth, scrollWidth, offsetWidth, clientWidth),
    Math.max(rectHeight, scrollHeight, offsetHeight, clientHeight),
  ];
};

export default (id: string) => {
  const element = document.getElementById(id);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const updater = useRef<number>(0);

  useEffect(() => {
    setTimeout(() => {
      const [newWidth, newHeight] = getElementSize(element);

      if (newWidth !== width) {
        setWidth(newWidth);
      }
      if (newHeight !== height) {
        setHeight(newHeight);
      }
    });
  }, [width, height, updater.current]);

  useLayoutEffect(() => {
    width && height && appWindow.setSize(new LogicalSize(width, height));
  }, [width, height]);

  updater.current++;
};
