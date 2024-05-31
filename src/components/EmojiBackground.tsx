import React from "react";

export default function EmojiBackground({ emoji }: { emoji: string }) {
  return (
    <div className="relative w-full">
      <p className="absolute text-4xl -rotate-12 opacity-25 left-9">{emoji}</p>
      <p className="absolute text-3xl rotate-10 opacity-25 bottom-2 left-20">
        {emoji}
      </p>
      <p className="absolute text-xl -rotate-[30deg] opacity-15 top-2 left-24">
        {emoji}
      </p>
      <p
        id="main-center"
        className="text-6xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        {emoji}
      </p>
      <p className="absolute text-2xl rotate-[30deg] opacity-25 top-4 right-24">
        {emoji}
      </p>
      <p className="absolute text-3xl rotate-[20deg] opacity-25 bottom-2 right-16">
        {emoji}
      </p>
      <p className="absolute text-4xl rotate-[30deg] opacity-25 right-9">
        {emoji}
      </p>
    </div>
  );
}
