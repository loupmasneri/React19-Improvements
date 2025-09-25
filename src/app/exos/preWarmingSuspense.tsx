/** 
 *  10) Suspense “pre-loading" (Pre-warming)
        Objectif: éviter un flash de fallback en pré-déclenchant la ressource.
        Mise en place

        Dans une page avec onglets, pré-démarre fetchTabData(tab) (qui retourne une promesse) au survol d’un onglet (mouseover).

        Quand l’utilisateur clique, rends le panneau <Suspense> qui consomme la promesse via use.
        Réussite: la plupart du temps, aucun fallback n’apparaît car la promesse a déjà démarré.
*/

"use client";

import { FunctionComponent } from "react";

const PreWarmingSuspense: FunctionComponent = ({}) => {
  return <></>;
};

export default PreWarmingSuspense;
