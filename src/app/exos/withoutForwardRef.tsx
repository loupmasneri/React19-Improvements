/**
 * 5) ref comme prop (sans forwardRef)
 * 
      Objectif: passer un ref à un composant fonctionnel sans forwardRef.
      Mise en place

      Écris MyInput({ ref, ...props }) { return <input ref={ref} {...props} /> }.

      Dans le parent, const ref = useRef(); <MyInput ref={ref} />.

      Ajoute un bouton “Focus” qui appelle ref.current.focus().
      Réussite: le focus fonctionne et aucun forwardRef n’est requis.
 */

"use client";
import { FunctionComponent, Ref, useRef, useState } from "react";
import { Button } from "../components/core/button";
import clsx from "clsx";

type CustomInputProps = {
  ref?: Ref<HTMLInputElement>;
  text: string;
  onTextChange: (text: string) => void;
  className?: string;
};

const CustomInput: FunctionComponent<CustomInputProps> = ({
  ref,
  text,
  onTextChange,
  className,
}) => {
  return (
    <input
      ref={ref}
      onChange={(event) => onTextChange(event.target.value)}
      value={text}
      className={clsx("outline-1 rounded-md text-black px-2 py-1", className)}
    />
  );
};

const WithoutForwardRef: FunctionComponent = ({}) => {
  const ref = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <Button color="indigo" onClick={() => ref.current?.focus()}>
        {"Focus sur l'input"}
      </Button>
      <CustomInput text={text} onTextChange={setText} ref={ref}></CustomInput>
    </div>
  );
};

export default WithoutForwardRef;
