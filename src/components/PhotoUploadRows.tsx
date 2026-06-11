"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";

type PhotoUploadRowsProps = {
  existingCount?: number;
  maxPhotos?: number;
  label: string;
};

export function PhotoUploadRows({ existingCount = 0, maxPhotos = 6, label }: PhotoUploadRowsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const [deletedExistingCount, setDeletedExistingCount] = useState(0);
  const [rows, setRows] = useState([0]);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const remainingSlots = Math.max(0, maxPhotos - Math.max(0, existingCount - deletedExistingCount));
  const visibleRows = rows.slice(0, remainingSlots);

  useEffect(() => {
    const formElement = rootRef.current?.closest("form");

    if (!formElement) {
      return;
    }

    const currentForm = formElement;

    function updateDeletedCount() {
      const checkedDeletes = currentForm.querySelectorAll<HTMLInputElement>('input[name="delete_image_id"]:checked').length;
      setDeletedExistingCount(checkedDeletes);
    }

    currentForm.addEventListener("change", updateDeletedCount);

    return () => currentForm.removeEventListener("change", updateDeletedCount);
  }, []);

  function removeRow(rowId: number) {
    setRows((currentRows) => {
      const nextRows = currentRows.filter((id) => id !== rowId);
      return nextRows.length > 0 || remainingSlots === 0 ? nextRows : [nextId.current++];
    });
    setSelectedRows((currentSelectedRows) => {
      const nextSelectedRows = new Set(currentSelectedRows);
      nextSelectedRows.delete(rowId);
      return nextSelectedRows;
    });
  }

  function handleFileChange(rowId: number, files: FileList | null) {
    const hasFile = Boolean(files?.length);

    setSelectedRows((currentSelectedRows) => {
      const nextSelectedRows = new Set(currentSelectedRows);

      if (hasFile) {
        nextSelectedRows.add(rowId);
      } else {
        nextSelectedRows.delete(rowId);
      }

      return nextSelectedRows;
    });

    if (hasFile) {
      setRows((currentRows) => {
        const currentVisibleRows = currentRows.slice(0, remainingSlots);
        const isLastRow = currentVisibleRows[currentVisibleRows.length - 1] === rowId;

        if (!isLastRow || currentVisibleRows.length >= remainingSlots) {
          return currentRows;
        }

        return [...currentVisibleRows, nextId.current++];
      });
    }
  }

  return (
    <div ref={rootRef} className="mt-4 rounded-lg border border-dashed border-line bg-fog p-4">
      <div className="flex min-w-0 items-center gap-3 text-sm font-semibold text-ink">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-moss">
            <Camera className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">{label}</span>
      </div>

      {remainingSlots > 0 ? (
        <div className="mt-3 space-y-2">
          {visibleRows.map((rowId, index) => (
            <div key={rowId} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
              <input
                id={`photos-${rowId}`}
                name="photos"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => handleFileChange(rowId, event.currentTarget.files)}
                className="min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm"
              />

              {visibleRows.length > 1 || selectedRows.has(rowId) ? (
                <button
                  type="button"
                  onClick={() => removeRow(rowId)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-zinc-600 hover:bg-white"
                  aria-label={`Odebrat řádek fotografie ${index + 1}`}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Odebrat
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-lg bg-white p-3 text-sm text-zinc-600">Limit {maxPhotos} fotek je naplněný.</p>
      )}

      <p className="mt-2 text-xs text-zinc-500">
        Fotky se uloží až po odeslání formuláře. První uložená fotografie je hlavní. Limit je {maxPhotos} fotek a celý upload může mít nejvýše 64 MB.
      </p>
    </div>
  );
}
