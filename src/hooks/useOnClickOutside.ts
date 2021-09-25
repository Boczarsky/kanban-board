import { RefObject, useEffect } from "react";

export default function useOnClickOutside(ref: RefObject<any>, onClickOutside: () => void) {
  useEffect(
    () => {
      const listener = (event: MouseEvent | TouchEvent) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        onClickOutside();
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },

    [ref, onClickOutside]
  );
}