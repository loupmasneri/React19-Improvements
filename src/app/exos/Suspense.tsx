/**
 * 4) use (lecture de promesse/ressource en rendu)
 * 
      Objectif: consommer une promesse avec use et Suspense.
      Mise en place

      Crée fetchComments() qui retourne une promesse résolue après 1 s.

      Dans Comments, fais const comments = use(commentsPromise); et rends la liste.

      Enrobe Comments dans <Suspense fallback="Chargement…">.
      Réussite: le fallback s’affiche, puis la liste apparaît quand la promesse se résout.
 * 
 */

"use client";

import React, {
  FunctionComponent,
  Suspense,
  use,
  useState,
  useTransition,
} from "react";
import { Button } from "../components/core/button";

type Result<T> = { ok: true; data: T } | { ok: false; error: unknown };

async function fetchComments() {
  await new Promise((res) => setTimeout(res, 2000));

  if (Math.random() < 0.3) {
    throw new Error("Server down");
  }

  return "Super excercice !";
}

function toResult<T>(p: Promise<T>): Promise<Result<T>> {
  return p.then(
    (data) => ({ ok: true, data }),
    (error) => ({ ok: false, error })
  );
}

const Comments: FunctionComponent<{
  commentsPromise: Promise<Result<string>>;
}> = ({ commentsPromise }) => {
  const response = use(commentsPromise);
  if (response.ok) {
    return (
      <p className="text-black">Voici le commentaire reçu : {response.data}</p>
    );
  } else {
    const msg =
      response.error instanceof Error
        ? response.error.message
        : String(response.error);
    return <p className="text-red-600">{`Erreur : ${msg}`}</p>;
  }
};

const CustomSuspense: FunctionComponent = ({}) => {
  const [commentsPromise, setCommentsPromise] = useState<Promise<
    Result<string>
  > | null>(null);
  const [isPending, startTransition] = useTransition();

  const Fallback = () => <p className="text-black">En attente de réponse...</p>;

  function launchPromise() {
    startTransition(() => {
      setCommentsPromise(toResult(fetchComments()));
    });
  }

  function resetComments() {
    setCommentsPromise(null);
  }

  return (
    <div>
      <div className="flex flex-row gap-4">
        <Button
          isLoading={isPending}
          disabled={isPending}
          color="indigo"
          onClick={launchPromise}
        >
          Voir le nouveau commentaire
        </Button>
        <Button color="orange" onClick={resetComments}>
          Réinitialiser
        </Button>
      </div>
      <Suspense fallback={<Fallback />}>
        {commentsPromise && <Comments commentsPromise={commentsPromise} />}
      </Suspense>
    </div>
  );
};

export default CustomSuspense;
