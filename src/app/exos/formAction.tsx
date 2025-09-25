/**
 * Implémente SubmitButton avec useFormStatus() pour désactiver et afficher “Envoi…”.
 * Réussite: le formulaire se reset après succès, l’état pending s’affiche sans gestion manuelle complexe.
 */

"use client";

import { FunctionComponent, useActionState } from "react";
import { Button } from "../components/core/button";
import { useFormStatus } from "react-dom";
import clsx from "clsx";

type FormState = { ok: boolean; error?: string };

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

async function submitAction(
  prev: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  // Simule un POST
  await new Promise((r) => setTimeout(r, 2000));
  if (!email.includes("@")) {
    return { ok: false, error: "Email invalide" };
  }
  return { ok: true, error: undefined };
}

const FormAction: FunctionComponent = ({}) => {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    submitAction,
    {
      ok: false,
      error: undefined,
    }
  );

  return (
    <form className="flex flex-col gap-4" action={action}>
      <input
        name="email"
        type="email"
        required
        placeholder="email@example.com"
        disabled={isPending}
        className={clsx(
          "outline-1 rounded-md text-black px-2 py-1",
          state.error ? "outline-red-600" : "outline-gray-300"
        )}
      />
      <Submit securePending={isPending} />
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p role="alert" className="text-sm text-lime-500">
          Succès
        </p>
      )}
    </form>
  );
};

export default FormAction;
