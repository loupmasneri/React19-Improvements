// components/CodeFromHast.tsx
"use client";

import * as React from "react";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { Root } from "hast";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";

export default function CodeFromHast({ tree }: { tree: Root }) {
  const components = {
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
      <pre
        {...props}
        className={
          "bg-[#0b0d10] text-gray-100 text-xs leading-6 max-h-[600px] overflow-auto p-4" +
          (props.className ? " " + props.className : "")
        }
      />
    ),
    code: (props: React.HTMLAttributes<HTMLElement>) => (
      <code {...props} className={props.className} />
    ),
  };

  return toJsxRuntime(tree, { Fragment, jsx, jsxs, components });
}
