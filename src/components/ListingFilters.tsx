"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, X } from "lucide-react";
import { clsx } from "clsx";
import { catalogCategories } from "@/lib/catalog";
import { conditionLabels } from "@/lib/format";
import type { ListingCondition } from "@/lib/types";

type ListingFiltersProps = {
  query: string;
  category: string;
  subcategory: string;
  sort: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
};

type PanelName = "category" | "subcategory" | "condition" | "price" | "sort" | null;

const sortOptions = [
  { value: "newest", label: "Nejnovější první" },
  { value: "price_asc", label: "Od nejlevnějších" },
  { value: "price_desc", label: "Od nejdražších" }
];

export function ListingFilters({ query, category, subcategory, sort, condition, minPrice, maxPrice }: ListingFiltersProps) {
  const [openPanel, setOpenPanel] = useState<PanelName>(null);
  const filterRef = useRef<HTMLFormElement>(null);
  const initialCategory = catalogCategories.find((item) => item.slug === category || item.label === category)?.label ?? "";
  const [categoryValue, setCategoryValue] = useState(initialCategory);
  const activeCategory = useMemo(() => catalogCategories.find((item) => item.label === categoryValue) ?? null, [categoryValue]);
  const initialSubcategory = activeCategory?.subcategories.find((item) => item.slug === subcategory || item.label === subcategory)?.label ?? "";
  const [subcategoryValue, setSubcategoryValue] = useState(initialSubcategory);

  const sortLabel = sortOptions.find((item) => item.value === sort)?.label ?? sortOptions[0].label;
  const conditionLabel = conditionLabels[condition as ListingCondition] ?? "";
  const hasPriceFilter = Boolean(minPrice || maxPrice);
  const clearAllHref = query ? `/inzeraty?q=${encodeURIComponent(query)}` : "/inzeraty";

  useEffect(() => {
    function closePanel(event: PointerEvent) {
      const target = event.target;

      if (target instanceof Node && !filterRef.current?.contains(target)) {
        setOpenPanel(null);
      }
    }

    document.addEventListener("pointerdown", closePanel);
    return () => document.removeEventListener("pointerdown", closePanel);
  }, []);

  function removeHref(keys: string[]) {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (category && !keys.includes("category")) params.set("category", category);
    if (subcategory && !keys.includes("subcategory")) params.set("subcategory", subcategory);
    if (sort && sort !== "newest" && !keys.includes("sort")) params.set("sort", sort);
    if (condition && !keys.includes("condition")) params.set("condition", condition);
    if (minPrice && !keys.includes("minPrice")) params.set("minPrice", minPrice);
    if (maxPrice && !keys.includes("maxPrice")) params.set("maxPrice", maxPrice);

    const queryString = params.toString();
    return queryString ? `/inzeraty?${queryString}` : "/inzeraty";
  }

  return (
    <form ref={filterRef} action="/inzeraty" className="rounded-xl border border-line bg-white p-3 shadow-[0_10px_24px_rgba(23,32,27,0.05)]">
      {query ? <input type="hidden" name="q" value={query} /> : null}
      {openPanel !== "category" && categoryValue ? <input type="hidden" name="category" value={categoryValue} /> : null}
      {openPanel !== "subcategory" && subcategoryValue ? <input type="hidden" name="subcategory" value={subcategoryValue} /> : null}
      {openPanel !== "condition" && condition ? <input type="hidden" name="condition" value={condition} /> : null}
      {openPanel !== "sort" && sort && sort !== "newest" ? <input type="hidden" name="sort" value={sort} /> : null}
      {openPanel !== "price" && minPrice ? <input type="hidden" name="minPrice" value={minPrice} /> : null}
      {openPanel !== "price" && maxPrice ? <input type="hidden" name="maxPrice" value={maxPrice} /> : null}

      <div className="flex flex-wrap items-center gap-2">
        <FilterPill label="Kategorie" active={Boolean(category)} open={openPanel === "category"} onClick={() => setOpenPanel(openPanel === "category" ? null : "category")} />
        <FilterPill label="Podkategorie" active={Boolean(subcategory)} open={openPanel === "subcategory"} onClick={() => setOpenPanel(openPanel === "subcategory" ? null : "subcategory")} />
        <FilterPill label="Stav" active={Boolean(condition)} open={openPanel === "condition"} onClick={() => setOpenPanel(openPanel === "condition" ? null : "condition")} />
        <FilterPill label="Cena" active={hasPriceFilter} open={openPanel === "price"} onClick={() => setOpenPanel(openPanel === "price" ? null : "price")} />
        <FilterPill label="Řadit podle" active={sort !== "newest"} open={openPanel === "sort"} onClick={() => setOpenPanel(openPanel === "sort" ? null : "sort")} />

        <button type="submit" className="inline-flex min-h-10 items-center justify-center rounded-full bg-moss px-5 text-[15px] font-bold text-white hover:bg-ink">
          Použít
        </button>
      </div>

      <div className="relative">
        {openPanel === "category" ? (
          <FilterPanel>
            <RadioOption name="category" value="" label="Všechny kategorie" checked={!categoryValue} onChange={() => {
              setCategoryValue("");
              setSubcategoryValue("");
            }} />
            {catalogCategories.map((item) => (
              <RadioOption
                key={item.label}
                name="category"
                value={item.label}
                label={item.label}
                checked={categoryValue === item.label}
                onChange={() => {
                  setCategoryValue(item.label);
                  setSubcategoryValue("");
                }}
              />
            ))}
            <PanelSubmit />
          </FilterPanel>
        ) : null}

        {openPanel === "subcategory" ? (
          <FilterPanel>
            {!activeCategory ? <p className="px-4 py-3 text-sm text-zinc-600">Nejdřív vyberte kategorii.</p> : null}
            <RadioOption name="subcategory" value="" label="Všechny podkategorie" checked={!subcategoryValue} onChange={() => setSubcategoryValue("")} disabled={!activeCategory} />
            {activeCategory?.subcategories.map((item) => (
              <RadioOption
                key={item.label}
                name="subcategory"
                value={item.label}
                label={item.label}
                checked={subcategoryValue === item.label}
                onChange={() => setSubcategoryValue(item.label)}
              />
            ))}
            <PanelSubmit />
          </FilterPanel>
        ) : null}

        {openPanel === "condition" ? (
          <FilterPanel>
            <RadioOption name="condition" value="" label="Všechny stavy" defaultChecked={!condition} />
            {Object.entries(conditionLabels).map(([value, label]) => (
              <RadioOption key={value} name="condition" value={value} label={label} defaultChecked={condition === value} />
            ))}
            <PanelSubmit />
          </FilterPanel>
        ) : null}

        {openPanel === "price" ? (
          <FilterPanel>
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink" htmlFor="min-price">
                  Cena od
                </label>
                <input id="min-price" name="minPrice" inputMode="numeric" type="number" min={0} defaultValue={minPrice} className="min-h-11 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-ink" htmlFor="max-price">
                  Cena do
                </label>
                <input id="max-price" name="maxPrice" inputMode="numeric" type="number" min={0} defaultValue={maxPrice} className="min-h-11 px-3 py-2 text-sm" />
              </div>
            </div>
            <PanelSubmit />
          </FilterPanel>
        ) : null}

        {openPanel === "sort" ? (
          <FilterPanel>
            {sortOptions.map((item) => (
              <RadioOption key={item.value} name="sort" value={item.value} label={item.label} defaultChecked={(sort || "newest") === item.value} />
            ))}
            <PanelSubmit />
          </FilterPanel>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {category ? <ActiveChip label={categoryValue || category} href={removeHref(["category", "subcategory"])} /> : null}
        {subcategory ? <ActiveChip label={subcategoryValue || subcategory} href={removeHref(["subcategory"])} /> : null}
        {conditionLabel ? <ActiveChip label={conditionLabel} href={removeHref(["condition"])} /> : null}
        {hasPriceFilter ? <ActiveChip label={`${minPrice || "0"} Kč - ${maxPrice || "∞"} Kč`} href={removeHref(["minPrice", "maxPrice"])} /> : null}
        {sort !== "newest" ? <ActiveChip label={sortLabel} href={removeHref(["sort"])} /> : null}

        {(category || subcategory || condition || hasPriceFilter || sort !== "newest") ? (
          <a href={clearAllHref} className="ml-auto inline-flex min-h-9 items-center text-[15px] font-semibold text-moss hover:text-ink">
            Vymazat filtry
          </a>
        ) : null}
      </div>
    </form>
  );
}

function FilterPill({ label, active, open, onClick }: { label: string; active: boolean; open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-[15px] font-semibold transition",
        active || open ? "border-moss bg-[#eefbfb] text-ink" : "border-line bg-white text-ink hover:border-moss"
      )}
      aria-expanded={open}
    >
      {label}
      <ChevronDown className={clsx("h-4 w-4 transition", open && "rotate-180")} aria-hidden="true" />
    </button>
  );
}

function FilterPanel({ children }: { children: ReactNode }) {
  return (
    <div className="absolute left-0 top-3 z-30 max-h-[420px] w-full overflow-y-auto rounded-xl border border-line bg-white shadow-[0_18px_30px_rgba(23,32,27,0.16)] sm:w-[380px]">
      {children}
    </div>
  );
}

function RadioOption({
  name,
  value,
  label,
  checked,
  defaultChecked,
  disabled,
  onChange
}: {
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
}) {
  return (
    <label className={clsx("flex cursor-pointer items-start justify-between gap-4 border-b border-line px-4 py-3 text-[15px]", disabled ? "text-zinc-400" : "text-ink hover:bg-fog")}>
      <span className="font-semibold">{label}</span>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
        className="mt-0.5 h-5 w-5"
      />
    </label>
  );
}

function PanelSubmit() {
  return (
    <div className="sticky bottom-0 border-t border-line bg-white p-3">
      <button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-moss px-4 text-[15px] font-bold text-white hover:bg-ink">
        Použít filtr
      </button>
    </div>
  );
}

function ActiveChip({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-line bg-fog px-3.5 text-[15px] font-semibold text-zinc-700 hover:border-moss hover:text-ink">
      {label}
      <X className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
