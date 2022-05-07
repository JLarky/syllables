import { createSignal, For, Signal, createMemo } from "solid-js";
import "./Syllables.css";

const syllables = ["ма", "па", "ка", "ти", "ша", "ила"];
const words = ["мама", "папа", "тиша", "илаша"];

export const Syllables: React.FC<{ initialState: string }> = (props) => {
  const initial = props.initialState.split(" ");
  const syllableSignals = [createSignal(initial[0]), createSignal(initial[1])];
  const isWord = createMemo(() => {
    const word = syllableSignals.map((signal) => signal[0]()).join("");
    return words.includes(word) ? word : undefined;
  });
  return (
    <>
      <div
        title={isWord()}
        className={`syllables ${isWord() ? "correct" : ""}`}
      >
        <For each={syllableSignals}>
          {(syllable) => <Syllable signal={syllable} />}
        </For>
      </div>
    </>
  );
};

export function getRandomSyllable() {
  return syllables[Math.floor(Math.random() * syllables.length)];
}

const Syllable: React.FC<{ signal: Signal<string> }> = (props) => {
  const [syllable, setSyllable] = props.signal;
  return (
    <button
      onClick={() => {
        let newS = getRandomSyllable();
        while (newS === syllable()) {
          newS = getRandomSyllable();
        }
        setSyllable(newS);
      }}
    >
      <Sound syllable={syllable()} />
      {syllable}
    </button>
  );
};

const Sound = (props: { syllable: string }) => {
  const [customSound, setCustomSound] = createSignal<string>(undefined);
  const [isRecording, setIsRecording] = createSignal<() => void>(undefined);
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(
        function (stream) {
          if (isRecording()) {
            return isRecording()();
          }
          console.log("stream", stream);
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start();
          let chunks = [];
          mediaRecorder.ondataavailable = function (e) {
            chunks.push(e.data);
            const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
            const audioURL = window.URL.createObjectURL(blob);
            setCustomSound(audioURL);
          };
          setIsRecording(() => () => {
            // mediaRecorder.requestData();
            mediaRecorder.stop();
            setIsRecording(undefined);
          });
        },
        function (err) {
          console.error("err", err);
        }
      );
  };
  return (
    <div class="sound">
      <div
        style={isRecording() ? "opacity: 0.5" : undefined}
        onClick={(e) => {
          e.stopPropagation();
          startRecording();
        }}
      >
        <MicIcon />
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          const { syllable } = props;
          const audio = new Audio(customSound() || `/${syllable}.mp3`);
          audio.play();
        }}
      >
        <SoundIcon />
      </div>
    </div>
  );
};

const SoundIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.0"
      width="15"
      height="15"
      viewBox="0 0 75 75"
    >
      <path
        d="M39.389 13.769 22.235 28.606H6v19.093h15.989l17.4 15.051V13.769z"
        style="stroke:#111;stroke-width:5;stroke-linejoin:round;fill:#111"
      />
      <path
        d="M48 27.6A19.5 19.5 0 0 1 48 49m7.1-28.5a30 30 0 0 1 0 35.6M61.6 14a38.8 38.8 0 0 1 0 48.6"
        style="fill:none;stroke:#111;stroke-width:5;stroke-linecap:round"
      />
    </svg>
  );
};

const MicIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 442 442"
    >
      <path d="M295.975 0c37.622 0 68.11 30.495 68.11 68.11 0 37.614-30.488 68.106-68.11 68.106-37.609 0-68.105-30.492-68.105-68.106C227.869 30.495 258.365 0 295.975 0z" />
      <path d="M148.576 256.536c5.681 0 10.722-2.561 14.183-6.532L277.4 144.44c-22.754-5.521-41.646-20.963-51.824-41.475l-90.567 120.557c-3.338 4.661-5.316 8.725-5.316 14.122 0 10.428 8.464 18.892 18.883 18.892z" />
      <path d="M93.474 358.007c38.097 29.274 96.661-26.176 98.849-28.292.629-.549 62.4-54.934 91.197-22.723 6.012 6.701 8.524 14.459 7.727 23.712-3.029 34.308-50.674 78.774-68.785 93.009-4.521 3.559-5.306 10.118-1.75 14.644a10.38 10.38 0 0 0 8.2 3.987c2.24 0 4.524-.737 6.407-2.217 2.962-2.324 72.25-57.222 76.683-107.575 1.334-15.107-3.021-28.381-12.937-39.465-12.695-14.198-36.695-26.878-78.794-6.668-23.048 11.044-41.072 27.069-42.104 27.987-12.385 11.854-52.203 42.259-72.002 27.054-4.31-3.31-6.524-7.313-6.989-12.595-1.559-18.238 17.721-44.495 27.312-55.483l21.362-7.449s-4.278-.477-14.351-9.506c-9.419-8.464-11.918-17.616-11.918-17.616l-9.614 19.532c-6.847 7.634-36.097 42.193-33.552 72.277.933 11.073 6.138 20.547 15.059 27.387z" />
    </svg>
  );
};
