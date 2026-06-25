import { useEffect, useRef, useState } from "react";

const ASCII = `            __ __
 .-----.--.--.-----|  |  .--.--.
 |  _  |  |  |  -__|  |  |  |  |
 |__   |_____|_____|__|__|___  |
     |__|                 |_____| `;

const CHARS = ASCII.split("");
const GLYPHS = "!@#$%^&*-+=[]{}|<>?0123456789";

function scramble() {
  return CHARS.map((c) =>
    c === " " || c === "\n"
      ? c
      : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
  ).join("");
}

export default function Logo() {
  const [displayed, setDisplayed] = useState(scramble);
  const resolved = useRef(new Set<number>());

  useEffect(() => {
    const nonSpace = CHARS.map((c, i) => (c !== " " && c !== "\n" ? i : -1))
      .filter((i) => i !== -1)
      .sort(() => Math.random() - 0.5);

    let head = 0;

    const id = setInterval(() => {
      for (let k = 0; k < 3 && head < nonSpace.length; k++, head++) {
        resolved.current.add(nonSpace[head]);
      }

      setDisplayed(
        CHARS.map((c, i) => {
          if (c === " " || c === "\n") return c;
          if (resolved.current.has(i)) return c;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }).join(""),
      );

      if (head >= nonSpace.length) clearInterval(id);
    }, 40);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col justify-center">
      <pre className="font-mono text-sm leading-none tracking-tight text-center whitespace-pre text-primary">
        {displayed}
      </pre>
      <span className="text-xs font-mono text-muted-foreground mt-1 text-center">
        admin's panel
      </span>
    </div>
  );
}
