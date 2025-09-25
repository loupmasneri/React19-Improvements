/**
 * 6) Feuilles de style intégrées (ordre/“precedence”)

      Objectif: charger une stylesheet spécifique à un composant avec contrôle d’ordre.
      Mise en place

      Dans ComponentA, rends <link rel="stylesheet" href="/a.css" precedence="low" />.

      Dans ComponentB, rends <link rel="stylesheet" href="/b.css" precedence="high" />.

      Crée des règles qui entrent en conflit et vérifie que high l’emporte.
      Réussite: la precedence respecte l’ordre attendu, même avec rendu concurrent/streaming.
 */

/* eslint-disable @next/next/no-css-tags */
"use client";

import { FunctionComponent } from "react";

function ComponentA() {
  return <link rel="stylesheet" href="a.css" precedence="low" />;
}

function ComponentB() {
  return <link rel="stylesheet" href="b.css" precedence="high" />;
}

const CssPrecedence: FunctionComponent = ({}) => {
  return (
    <div className="flex flex-col gap-4">
      <ComponentA />
      <ComponentB />

      <div className="demo-box">Je suis stylisé</div>
    </div>
  );
};

export default CssPrecedence;
