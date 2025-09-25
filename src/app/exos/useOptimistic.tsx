/**
 * 3) useOptimistic

      Objectif: appliquer un update optimiste d’une liste (todo/likes).
      Mise en place

      Stocke une liste dans items.

      const [optimisticItems, addOptimisticItem] = useOptimistic(items);

      Dans l’Action du formulaire, appelle immédiatement addOptimisticItem([...optimisticItems, draft]), puis fais l’appel réseau simulé qui peut échouer.

      Vérifie que l’UI se “rollback” en cas d’échec.
      Réussite: l’élément apparaît instantanément puis reste/disparaît selon la réussite.
 */

"use client";

import clsx from "clsx";
import {
  FunctionComponent,
  useActionState,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../components/core/button";

type FormState = { ok: boolean; error?: string };
type Message = { text: string; sending: boolean; key: number };
type Patch = { type: "add"; text: string } | { type: "clear" };

function Submit({ securePending }: { securePending: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      color="indigo"
      type="submit"
      isLoading={securePending || pending}
      disabled={securePending || pending}
    >
      {pending ? "Submitting..." : "Submit"}
    </Button>
  );
}

const UseOptimistic: FunctionComponent = ({}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isClearing, startClearing] = useTransition();
  const [clearWorked, setClearWorked] = useState<boolean | undefined>();

  const [optimisticMessages, applyPatch] = useOptimistic<Message[], Patch>(
    messages,
    (state, patch) => {
      if (patch.type === "add") {
        return [{ key: Date.now(), text: patch.text, sending: true }, ...state];
      }
      // clear
      return [];
    }
  );

  async function submitAction(
    prev: FormState,
    formData: FormData
  ): Promise<FormState> {
    const draft = String(formData.get("message") ?? "");
    applyPatch({ type: "add", text: draft });
    // Simule un POST
    await new Promise((r) => setTimeout(r, 2000));

    const fail = Math.random() < 0.3;
    if (fail) {
      setMessages((prev) => prev);
      return { ok: false, error: "Échec réseau" };
    }

    setMessages((prev) => [
      { text: draft, sending: false, key: Date.now() },
      ...prev,
    ]);

    return {
      ok: true,
    };
  }

  const [state, action, isPending] = useActionState<FormState, FormData>(
    submitAction,
    {
      ok: false,
    }
  );

  async function emptyList() {
    setClearWorked(undefined);
    startClearing(async () => {
      applyPatch({ type: "clear" });
      // Simule un POST
      await new Promise((r) => setTimeout(r, 2000));
      const fail = Math.random() < 0.3;
      if (fail) {
        setClearWorked(false);
        setMessages((prev) => prev);
      } else {
        setClearWorked(true);
        setMessages([]);
      }
    });
  }

  console.log("clearWorked:", clearWorked);

  return (
    <form className="flex flex-col gap-4" action={action}>
      <input
        name="message"
        required
        disabled={isPending}
        className={clsx(
          "outline-1 rounded-md text-black px-2 py-1",
          state.error ? "outline-red-600" : "outline-gray-300"
        )}
      />
      <div className="flex flex-row gap-4">
        <Submit securePending={isPending} />
        <Button
          disabled={isClearing || isPending}
          isLoading={isClearing}
          onClick={emptyList}
          color="orange"
        >
          Vider la liste
        </Button>
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="alert" className="text-sm text-lime-500">
          Succès !
        </p>
      )}
      {clearWorked != undefined && (
        <p
          role="alert"
          className={clsx(
            "text-sm",
            clearWorked ? "text-lime-500" : "text-red-600"
          )}
        >
          {clearWorked
            ? "La liste a correctement était vidée"
            : "Une erreur est survenue"}
        </p>
      )}
      <ul className="flex-1 space-y-2">
        {optimisticMessages.map((m) => (
          <li
            key={m.key}
            className={clsx(
              "rounded border px-3 py-2 text-black",
              m.sending && "opacity-40 italic"
            )}
          >
            {m.text}
            {m.sending && <span> • sending…</span>}
          </li>
        ))}
      </ul>
    </form>
  );
};

export default UseOptimistic;
