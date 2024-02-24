import { Component, Show, createSignal } from "solid-js";
import { Motion, Presence } from "solid-motionone";

import cls from "./toast.module.css";

/**
 * An auto-fading toast component.
 */
export const Toast: Component<{
  text: string;
}> = (props) => {
  const [visible, setVisible] = createSignal(true);

  return (
    <Presence>
      <Show when={visible()}>
        <Motion.output
          initial={{ transform: "scale(0)" }}
          animate={{ transform: "scale(1)" }}
          exit={{ transform: "scale(0)" }}
          transition={{
            duration: 0.4,
            endDelay: 0.8,
            easing: [0.25, 0.46, 0.45, 0.94],
          }}
          role="status"
          class={cls.toast}
          onMotionComplete={() => {
            setVisible(false);
          }}
        >
          {props.text}
        </Motion.output>
      </Show>
    </Presence>
  );
};
