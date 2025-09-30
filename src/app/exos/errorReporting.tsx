/**
 * 11) Meilleur reporting d’erreurs

      Objectif: observer la nouvelle sortie d’erreurs (moins verbeuse, non dupliquée) avec Error Boundary.
      Mise en place

      Crée Throws qui lève une erreur en rendu.

      Enrobe avec un Error Boundary et ouvre la console.
      Réussite: un seul log d’erreur clair et complet apparaît.
 */

"use client";

import React, { ReactNode } from "react";
import { Button } from "../components/core/button";

type ErrorBoundaryProps = React.PropsWithChildren<{
  fallback: React.ReactNode;
}>;
type ErrorBoundaryState = { error: Error | null };

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Captured by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.error) return this.props.fallback;
    return this.props.children as React.ReactNode;
  }
}

function Throws(): ReactNode {
  throw new Error("Erreur de test (phase de rendu)");
}

export default function ErrorReporting() {
  const [crash, setCrash] = React.useState(false);
  const [resetKey, setResetKey] = React.useState(0);

  return (
    <div className="flex flex-col gap-3">
      <ErrorBoundary
        key={resetKey}
        fallback={
          <div className="text-red-600">
            <Button color="orange" onClick={() => setResetKey((k) => k + 1)}>
              Réessayer
            </Button>
            <p className="mt-2 whitespace-pre-line">
              {
                "Une erreur est survenue.\nRegardez la console (F12 -> console)."
              }
            </p>
          </div>
        }
      >
        {crash ? (
          <Throws />
        ) : (
          <Button color="red" onClick={() => setCrash(true)}>
            Déclencher une erreur
          </Button>
        )}
      </ErrorBoundary>
    </div>
  );
}
