"use client";

import * as React from "react";
import { Button } from "./core/button";
import CodeFromHast from "./CodeFromHast";
import type { Root } from "hast";
import clsx from "clsx";

type DemoBlockProps = {
  title: string;
  code: string;
  codeHast: Root;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export default function DemoBlock({
  title,
  code,
  codeHast,
  children,
  defaultOpen,
}: DemoBlockProps) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  return (
    <section className="w-full">
      <header className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-black">{title}</h2>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setOpen((v) => !v)}
            color="light"
            aria-expanded={open}
            aria-controls={`${title}-code`}
          >
            {open ? "Hide code" : "Show code"}
          </Button>
          <Button onClick={copy} color="light" title="Copy code">
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-4">{children}</div>
        {open && (
          <div
            id={`${title}-code`}
            className={clsx(
              "col-span-2 rounded-2xl border overflow-hidden transition-all md:max-h-none md:opacity-100",
              open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <CodeFromHast tree={codeHast} />
          </div>
        )}
      </div>
    </section>
  );
}
