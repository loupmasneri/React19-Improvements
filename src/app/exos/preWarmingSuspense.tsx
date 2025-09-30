/** 
 *  10) Suspense “pre-loading" (Pre-warming)
        Objectif: éviter un flash de fallback en pré-déclenchant la ressource.
        Mise en place

        Dans une page avec onglets ou dans un composant, pré-démarre fetchTabData(tab) (qui retourne une promesse) au survol d’un onglet (mouseover).

        Quand l’utilisateur clique, rends le panneau <Suspense> qui consomme la promesse via use.
        Réussite: la plupart du temps, aucun fallback n’apparaît car la promesse a déjà démarré.
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

type Details = { title: string; body: string };

function fetchDetails(): Promise<Details> {
  return new Promise((res) =>
    setTimeout(
      () =>
        res({
          title: "Aperçu",
          body: `Chargé à ${new Date().toLocaleTimeString()}`,
        }),
      2000
    )
  );
}

function DetailsPanel({ promise }: { promise: Promise<Details> }) {
  const data = use(promise);

  return (
    <div className="rounded border p-4 text-black">
      <h3 className="font-semibold">{data.title}</h3>
      <p>{data.body}</p>
    </div>
  );
}

const PreWarmingSuspense: FunctionComponent = ({}) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Promise<Details> | null>(null);
  const [next, setNext] = useState<Promise<Details> | null>(null);
  const [isWarming, startWarming] = useTransition(); // don't block the UI

  const warmNext = () => {
    if (next) {
      return;
    }

    startWarming(() => setNext(fetchDetails()));
  };

  const openOrRefresh = () => {
    setOpen(true);

    if (next) {
      setCurrent(next);
      setNext(null);
      warmNext();
    } else {
      setCurrent(fetchDetails());
    }
  };

  const reset = () => {
    setOpen(false);
    setCurrent(null);
    setNext(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <Button
          color={"indigo"}
          onMouseEnter={warmNext}
          onClick={openOrRefresh}
          disabled={isWarming}
        >
          {open ? "Rafraîchir" : "Afficher les détails"}
        </Button>
        <Button color="orange" onClick={reset}>
          Réinitialiser
        </Button>
      </div>
      {open && current && (
        <Suspense fallback={<p className="text-black">Chargement...</p>}>
          <DetailsPanel promise={current} />
        </Suspense>
      )}
    </div>
  );
};

export default PreWarmingSuspense;
