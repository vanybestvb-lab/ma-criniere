"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
      onClick={() => window.print()}
    >
      Bon de préparation
    </button>
  );
}
