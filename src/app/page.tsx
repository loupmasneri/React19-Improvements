// app/page.tsx
import fs from "node:fs/promises";
import path from "node:path";
import { Suspense } from "react";
import DemoBlock from "./components/DemoBlocks";
import AsyncTransitions from "./exos/asyncTransitions";
import CssPrecedence from "./exos/cssPrecedence";
import FormAction from "./exos/formAction";
import UseOptimistic from "./exos/useOptimistic";
import WithoutForwardRef from "./exos/withoutForwardRef";
import { highlightToHast } from "./utils/highlight";
import PreWarmingSuspense from "./exos/preWarmingSuspense";

async function getSource(src: string) {
  const file = path.join(process.cwd(), "/src/app", src);
  return fs.readFile(file, "utf8");
}

export type File = { title: string; src: string; component: React.ReactNode };

export default async function Home() {
  const files: File[] = [
    {
      title: "UseTransition hook",
      src: "exos/asyncTransitions.tsx",
      component: <AsyncTransitions />,
    },
    {
      title: "Form actions",
      src: "exos/formAction.tsx",
      component: <FormAction />,
    },
    {
      title: "UseOptimistic hook",
      src: "exos/useOptimistic.tsx",
      component: <UseOptimistic />,
    },
    {
      title: "use + Suspense",
      src: "exos/Suspense.tsx",
      component: <Suspense />,
    },
    {
      title: "Ref as prop (no forwardRef)",
      src: "exos/withoutForwardRef.tsx",
      component: <WithoutForwardRef />,
    },
    {
      title: "CSS Precedence",
      src: "exos/cssPrecedence.tsx",
      component: <CssPrecedence />,
    },
    {
      title: "Pre-warming Suspense",
      src: "exos/preWarmingSuspense.tsx",
      component: <PreWarmingSuspense />,
    },
  ];

  const sources = await Promise.all(
    files.map(async ({ title, src, component }) => {
      const code = await getSource(src);
      const codeHast = await highlightToHast(code, "tsx");
      return { title, src, code, codeHast, component };
    })
  );

  return (
    <div className="flex flex-col min-h-screen p-16 gap-16 bg-white">
      {sources.map(({ title, src, code, codeHast, component }) => {
        return (
          <DemoBlock key={src} title={title} code={code} codeHast={codeHast}>
            {component}
          </DemoBlock>
        );
      })}
    </div>
  );
}
