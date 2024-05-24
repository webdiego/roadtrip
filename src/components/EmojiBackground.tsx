import React from "react";

export default function EmojiBackground({ emoji }: { emoji: string }) {
  return (
    <div className="relative w-full">
      <p className="absolute text-4xl -rotate-12 opacity-15 right-9">{emoji}</p>
      <p className="absolute text-3xl rotate-10 opacity-15 bottom-2 right-20">
        {emoji}
      </p>

      <p
        id="main-center"
        className="text-6xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        {emoji}
      </p>
      <p className="absolute text-2xl rotate-12 opacity-15 bottom-10 left-0">
        {emoji}
      </p>
      <p className="absolute text-4xl -rotate-12 opacity-15 left-9">{emoji}</p>
      <p className="absolute text-3xl rotate-10 opacity-15 bottom-2 left-20">
        {emoji}
      </p>
    </div>
  );
}
