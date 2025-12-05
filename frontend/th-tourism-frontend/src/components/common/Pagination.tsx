// src/components/common/Pagination.tsx
import React from "react";

type Props = {
  page: number;
  totalPage: number;
  onChangePage: (p: number) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Pagination({ page, totalPage, onChangePage }: Props) {
  if (!totalPage || totalPage <= 1) return null;

  const p = clamp(page || 1, 1, totalPage);

  // รวมหมายเลขที่ "ต้องมี"
  const bag = new Set<number>();
  const add = (n: number) => {
    if (n >= 1 && n <= totalPage) bag.add(n);
  };

  // ต้น/ท้าย
  add(1);
  add(2);
  add(totalPage - 1);
  add(totalPage);

  // หน้าปัจจุบันและรอบ ๆ
  add(p - 2);
  add(p - 1);
  add(p);
  add(p + 1);
  add(p + 2);

  // แปลงเป็นอาร์เรย์ เรียง และคั่นด้วย "…"
  const nums = Array.from(bag).sort((a, b) => a - b);

  const items: (number | string)[] = [];
  for (let i = 0; i < nums.length; i++) {
    const curr = nums[i];
    const prev = nums[i - 1];
    if (i > 0 && curr - (prev ?? curr) > 1) {
      items.push("…");
    }
    items.push(curr);
  }

  const btn = (label: React.ReactNode, disabled: boolean, target?: number) => (
    <button
      key={`${label}-${target ?? ""}`}
      className={
        "px-3 py-1 rounded border text-sm " +
        (typeof label === "number" && label === p
          ? "bg-black text-white"
          : "bg-white") +
        (disabled ? " opacity-60 cursor-not-allowed" : " hover:bg-gray-50")
      }
      onClick={() => !disabled && target && onChangePage(target)}
      disabled={disabled}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center gap-2">
      {btn("Prev", p === 1, p - 1)}
      {items.map((it, idx) =>
        it === "…" ? (
          <span key={`dots-${idx}`} className="px-2 text-gray-500 select-none">
            …
          </span>
        ) : (
          btn(it as number, false, it as number)
        )
      )}
      {btn("Next", p === totalPage, p + 1)}
      <span className="ml-3 text-sm text-gray-600">
        Page <b>{p}</b> / {totalPage}
      </span>
    </div>
  );
}
