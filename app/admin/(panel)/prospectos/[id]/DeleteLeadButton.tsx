"use client";

import { deleteLead } from "../../actions";

export function DeleteLeadButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteLead.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Delete the lead "${name}"? This can't be undone.`)) e.preventDefault();
      }}
    >
      <button type="submit" className="cursor-pointer text-sm font-medium text-danger hover:underline">
        Delete lead
      </button>
    </form>
  );
}
