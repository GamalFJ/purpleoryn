"use client";

// Adapted from 21st.dev "Accordion" by ddoemonn: spring-animated, auto-measured
// height, arrow-key navigation between headers. Restyled to the site tokens and
// the panel no longer scrolls internally (FAQ answers are short).
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";

const DISCLOSE = { type: "spring", stiffness: 480, damping: 40, mass: 0.6 } as const;
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function useAutoHeight() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [ready, setReady] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const next = el.getBoundingClientRect().height;
      setHeight((prev) => (Math.abs(prev - next) < 0.5 ? prev : next));
    };
    read();
    setReady(true);
    const observer = new ResizeObserver(read);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, height, ready };
}

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export function Accordion({ items, headingLevel = 3 }: { items: AccordionItem[]; headingLevel?: number }) {
  const base = useId();
  const [openId, setOpenId] = useState<string | null>(null);
  const headers = useRef(new Map<string, HTMLButtonElement>());
  const reduced = Boolean(useReducedMotion());

  const focusAt = useCallback(
    (index: number) => {
      const target = items[(index + items.length) % items.length];
      headers.current.get(target.id)?.focus();
    },
    [items],
  );

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, index) => {
        const open = openId === item.id;
        return (
          <AccordionRow
            key={item.id}
            item={item}
            open={open}
            reduced={reduced}
            headingLevel={headingLevel}
            headerId={`${base}-h-${item.id}`}
            panelId={`${base}-p-${item.id}`}
            bindHeader={(node) => (node ? headers.current.set(item.id, node) : headers.current.delete(item.id))}
            onToggle={() => setOpenId(open ? null : item.id)}
            onKeyDown={(e) => {
              const target = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: items.length - 1 }[e.key];
              if (target === undefined) return;
              e.preventDefault();
              focusAt(target);
            }}
          />
        );
      })}
    </div>
  );
}

function AccordionRow({
  item,
  open,
  reduced,
  headingLevel,
  headerId,
  panelId,
  bindHeader,
  onToggle,
  onKeyDown,
}: {
  item: AccordionItem;
  open: boolean;
  reduced: boolean;
  headingLevel: number;
  headerId: string;
  panelId: string;
  bindHeader: (node: HTMLButtonElement | null) => void;
  onToggle: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  const { ref, height, ready } = useAutoHeight();

  useEffect(() => {
    const el = ref.current as (HTMLDivElement & { inert?: boolean }) | null;
    if (el) el.inert = !open;
  }, [ref, open]);

  return (
    <div>
      <div role="heading" aria-level={headingLevel}>
        <button
          ref={bindHeader}
          id={headerId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          onKeyDown={onKeyDown}
          className="flex w-full cursor-pointer items-center gap-4 py-5 text-left text-[17px] font-medium transition-colors hover:text-accent"
        >
          <span className="flex-1">{item.title}</span>
          <motion.span
            aria-hidden="true"
            initial={false}
            animate={{ rotate: open ? 180 : 0 }}
            transition={reduced ? { duration: 0 } : DISCLOSE}
            className="shrink-0 text-muted"
          >
            <CaretDown size={18} weight="bold" />
          </motion.span>
        </button>
      </div>
      <motion.div
        initial={false}
        animate={ready ? { height: open ? height : 0 } : {}}
        transition={reduced ? { duration: 0 } : DISCLOSE}
        style={{ overflow: "hidden", height: ready ? undefined : open ? "auto" : 0 }}
      >
        <div ref={ref} id={panelId} role="region" aria-labelledby={headerId} aria-hidden={open ? undefined : true}>
          <div className="max-w-[65ch] pb-6 text-[15px] leading-relaxed text-body">{item.content}</div>
        </div>
      </motion.div>
    </div>
  );
}
