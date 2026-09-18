"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { IMAGE_RATIOS, decodeImage, type CropRect, type ImageRatio } from "@/lib/image";

const MAX_ZOOM = 3;
const KEY_STEP = 12;

interface Pending {
  bitmap: ImageBitmap;
  src: string;
  ratio: ImageRatio;
  name: string;
  resolve: (result: { bitmap: ImageBitmap; crop: CropRect } | null) => void;
}

// Fixed-ratio crop step for admin uploads: the image always covers the frame,
// the admin drags (or uses the arrow keys) to choose the framing and can zoom
// in. Returns the chosen rectangle in source pixels.
function CropDialog({ pending, onDone }: { pending: Pending; onDone: (crop: CropRect | null) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<{ x: number; y: number } | null>(null);
  const zoomId = useId();
  const { bitmap, src, ratio, name } = pending;
  const nat = { w: bitmap.width, h: bitmap.height };
  const spec = IMAGE_RATIOS[ratio];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const read = () => setFrame({ w: el.clientWidth, h: el.clientHeight });
    read();
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = frame.w ? Math.max(frame.w / nat.w, frame.h / nat.h) * zoom : 0;
  const disp = { w: nat.w * scale, h: nat.h * scale };

  const clamp = useCallback(
    (x: number, y: number) => ({
      x: Math.min(0, Math.max(frame.w - disp.w, x)),
      y: Math.min(0, Math.max(frame.h - disp.h, y)),
    }),
    [frame.w, frame.h, disp.w, disp.h],
  );

  // Start centered once the frame has a size.
  useEffect(() => {
    if (frame.w && offset === null) setOffset({ x: (frame.w - disp.w) / 2, y: (frame.h - disp.h) / 2 });
  }, [frame.w, frame.h, disp.w, disp.h, offset]);

  const pos = offset ? clamp(offset.x, offset.y) : { x: 0, y: 0 };

  function changeZoom(next: number) {
    if (!scale || !offset) return setZoom(next);
    // Keep the point under the frame's center fixed while zooming.
    const cx = (frame.w / 2 - pos.x) / scale;
    const cy = (frame.h / 2 - pos.y) / scale;
    const nextScale = (scale / zoom) * next;
    setZoom(next);
    setOffset({ x: frame.w / 2 - cx * nextScale, y: frame.h / 2 - cy * nextScale });
  }

  function confirm() {
    if (!scale) return;
    const width = Math.min(nat.w, frame.w / scale);
    const height = Math.min(nat.h, frame.h / scale);
    onDone({
      x: Math.max(0, Math.min(nat.w - width, -pos.x / scale)),
      y: Math.max(0, Math.min(nat.h - height, -pos.y / scale)),
      width,
      height,
    });
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onDone(null);
      }}
      aria-labelledby={`${zoomId}-title`}
      className="m-auto w-[min(34rem,calc(100vw-2rem))] rounded-[var(--radius-panel)] border border-line bg-surface p-5 text-body backdrop:bg-plum/60 sm:p-6"
    >
      <h2 id={`${zoomId}-title`} className="text-xl font-semibold">
        Adjust the framing
      </h2>
      <p className="mt-1 text-sm text-muted">
        Drag the image to choose what shows. {spec.label} ratio, same as on the site.
      </p>

      <div
        ref={frameRef}
        tabIndex={0}
        role="application"
        aria-label={`Framing for ${name}. Use the arrow keys to move the image.`}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          const dy = e.clientY - drag.current.y;
          drag.current = { x: e.clientX, y: e.clientY };
          setOffset(clamp(pos.x + dx, pos.y + dy));
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={(e) => {
          const move = { ArrowLeft: [KEY_STEP, 0], ArrowRight: [-KEY_STEP, 0], ArrowUp: [0, KEY_STEP], ArrowDown: [0, -KEY_STEP] }[e.key];
          if (!move) return;
          e.preventDefault();
          setOffset(clamp(pos.x + move[0], pos.y + move[1]));
        }}
        className={cn(
          "relative mx-auto mt-5 cursor-grab touch-none select-none overflow-hidden rounded-[var(--radius-field)] bg-paper active:cursor-grabbing",
          spec.className,
          ratio === "portrait" ? "w-full max-w-[17rem]" : "w-full",
        )}
      >
        {scale > 0 && (
          // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
          <img
            src={src}
            alt=""
            draggable={false}
            className="pointer-events-none absolute left-0 top-0 max-w-none"
            style={{ width: disp.w, height: disp.h, transform: `translate(${pos.x}px, ${pos.y}px)` }}
          />
        )}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/10" />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <label htmlFor={zoomId} className="text-sm font-semibold">
          Zoom
        </label>
        <input
          id={zoomId}
          type="range"
          min={1}
          max={MAX_ZOOM}
          step={0.01}
          value={zoom}
          onChange={(e) => changeZoom(Number(e.target.value))}
          className="h-11 flex-1 cursor-pointer accent-[var(--accent)]"
        />
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-line pt-5">
        <button type="button" onClick={() => onDone(null)} className={buttonClass("secondary", "md")}>
          Cancel
        </button>
        <button type="button" onClick={confirm} disabled={!scale} className={buttonClass("primary", "md")}>
          Use this framing
        </button>
      </div>
    </dialog>
  );
}

// requestCrop(file, ratio) decodes the file, shows the crop dialog and
// resolves with the decoded bitmap and chosen rectangle (null if cancelled).
// The caller owns the bitmap and must close() it. Render `cropper` once.
export function useImageCropper(): {
  requestCrop: (file: File, ratio: ImageRatio) => Promise<{ bitmap: ImageBitmap; crop: CropRect } | null>;
  cropper: ReactNode;
} {
  const [pending, setPending] = useState<Pending | null>(null);

  const requestCrop = useCallback(async (file: File, ratio: ImageRatio) => {
    const bitmap = await decodeImage(file);
    const src = URL.createObjectURL(file);
    return new Promise<{ bitmap: ImageBitmap; crop: CropRect } | null>((resolve) => {
      setPending({ bitmap, src, ratio, name: file.name, resolve });
    });
  }, []);

  const cropper = pending ? (
    <CropDialog
      key={pending.src}
      pending={pending}
      onDone={(crop) => {
        URL.revokeObjectURL(pending.src);
        if (crop) {
          pending.resolve({ bitmap: pending.bitmap, crop });
        } else {
          pending.bitmap.close();
          pending.resolve(null);
        }
        setPending(null);
      }}
    />
  ) : null;

  return { requestCrop, cropper };
}
