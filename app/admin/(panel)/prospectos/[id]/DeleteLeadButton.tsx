"use client";

import { deleteLead } from "../../actions";

export function DeleteLeadButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteLead.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`¿Eliminar el prospecto "${name}"? No se puede deshacer.`)) e.preventDefault();
      }}
    >
      <button type="submit" className="cursor-pointer text-sm font-medium text-danger hover:underline">
        Eliminar prospecto
      </button>
    </form>
  );
}
