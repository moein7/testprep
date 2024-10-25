"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [selection, setSelection] = useState<string>();
  const [position, setPosition] = useState<Record<string, number>>();
  const [answers, setAnswers] = useState<string[]>([]);
  const [newtext, setNextText] = useState<string>();

  function onSelectEnd() {
    const activeSelection = document.getSelection();
    const text = activeSelection?.toString();

    if (!activeSelection || !text) {
      setSelection(undefined);
      return;
    }

    setSelection(text);

    const rect = activeSelection.getRangeAt(0).getBoundingClientRect();

    setPosition({
      x: rect.left + rect.width / 2 - 80 / 2,
      y: rect.top + window.scrollY - 30,
      width: rect.width,
      height: rect.height,
    });
  }

  function onSelectStart() {
    setSelection(undefined);
  }

  useEffect(() => {
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("mouseup", onSelectEnd);
    return () => {
      document.removeEventListener("selectstart", onSelectStart);

      document.removeEventListener("mouseup", onSelectEnd);
    };
  }, []);

  const sampleText = `Lorem ipsum, 123123 dolor sit amet consectetur adipisicing elit. Aliquam eaque
  rem neque magnam odit qui, repudiandae repellat aut placeat culpa enim
  incidunt recusandae natus! Autem, illum nobis! Voluptatem, officiis
  similique.`;

  function onShare() {
    if (!selection) return;
    const message = `answer is : ${selection}`;
    const newAnswers = [...answers, selection];
    setAnswers(newAnswers);
    const questionObject = {
      questionId: uuidv4(),
      questionBody: message,
      qustionAnswers: newAnswers,
      options: null,
    };
    console.log(questionObject);
    textToArray(sampleText, newAnswers);
  }

  function textToArray(text: string, newAnswers: string[]) {
    const words = text
      .replace(/\n\n*/g, "\r\n")
      .replace(/^\s+|\s+$/gm, "")
      .split(" ");

    let answerNumber = 1;
    const newText = words.map((t) => {
      const findWord = newAnswers.includes(t);
      if (findWord) {
        t = `${answerNumber}-------`;
        answerNumber = answerNumber + 1;
      }
      return t;
    });
    setNextText(newText.join(" "));
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p>{sampleText}</p>

      <div role="dialog" aria-labelledby="share" aria-haspopup="dialog">
        {selection && position && (
          <p
            className="
            absolute -top-2 left-0 w-[180px] h-[30px] bg-black text-white rounded m-0
            after:absolute after:top-full after:left-1/2 after:-translate-x-2 after:h-0 after:w-0 after:border-x-[6px] after:border-x-transparent after:border-b-[8px] after:border-b-black after:rotate-180
          "
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            }}
          >
            <button
              className="flex w-full h-full justify-between items-center px-2 bg-gray-500 rounded-lg"
              onClick={() => onShare()}
            >
              <span id="share" className="text-xs">
                Select as answer
              </span>
            </button>
          </p>
        )}
        <p>{newtext}</p>
      </div>
    </div>
  );
}
