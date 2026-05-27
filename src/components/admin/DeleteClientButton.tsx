"use client";

import { useState } from "react";
import { deleteClientAction } from "@/app/admin/actions";
import { SubmitButton } from "./SubmitButton";

export function DeleteClientButton({
  clientId,
  clientName,
}: {
  clientId: string;
  clientName: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="mt-4 rounded-full border border-red-500 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50"
      >
        Eliminar cliente
      </button>
    );
  }

  return (
    <form action={deleteClientAction} className="mt-4">
      <input type="hidden" name="id" value={clientId} />
      <p className="text-sm text-red-600">
        ¿Eliminar <b>{clientName}</b>? Esta acción no se puede deshacer.
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <SubmitButton
          pendingText="Eliminando…"
          className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sí, eliminar
        </SubmitButton>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-full border border-ink/15 px-4 py-2 text-sm text-ink/70 transition hover:bg-ink/5"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
