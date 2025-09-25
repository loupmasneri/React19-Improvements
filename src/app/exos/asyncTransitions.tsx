/** 
 * 1) Actions (transitions asynchrones)

      Objectif: convertir un onSubmit classique en Action qui gère loading/erreur automatiquement.
      Mise en place

      Crée un composant UpdateName avec un champ texte.

      Utilise useTransition() et déclenche startTransition(async () => …) pour appeler une API fictive updateName.

      Désactive le bouton quand isPending est vrai et affiche une erreur simulée.
      Réussite: le bouton passe en état “loading” pendant l’appel, l’erreur s’affiche si l’API renvoie une erreur.
)
*/

"use client";

import { FunctionComponent, useState, useTransition } from "react";
import { Button } from "../components/core/button";

const SUCCESS = "Appel réussi";

const sleep = async (ms: number) => {
  return new Promise((res) => setTimeout(res, ms));
};

const updateNameAPI = async () => {
  await sleep(2000);
  if (Math.random() < 0.5) {
    throw new Error("Échec réseau");
  }
  return SUCCESS;
};

const AsyncTransitions: FunctionComponent = ({}) => {
  const [isPending, startTransition] = useTransition();
  const [buttonText, setButtonText] = useState("Faire l'appel API");
  const [error, setError] = useState<string>();

  const submitAction = async () => {
    setError(undefined);
    const newButtonText = await updateNameAPI();
    setButtonText(newButtonText);
  };

  return (
    <div>
      <Button
        color={buttonText === SUCCESS ? "lime" : "indigo"}
        isLoading={isPending}
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            try {
              await submitAction();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Erreur inconnue");
              setButtonText("Retenter");
            }
          });
        }}
      >
        {buttonText}
      </Button>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default AsyncTransitions;
