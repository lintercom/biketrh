"use client";

import { useMemo, useState } from "react";
import { catalogCategories, defaultCatalogCategory } from "@/lib/catalog";

type CategoryFieldsProps = {
  defaultCategory?: string;
  defaultSubcategory?: string;
};

export function CategoryFields({ defaultCategory = defaultCatalogCategory.label, defaultSubcategory = "" }: CategoryFieldsProps) {
  const initialCategory = catalogCategories.find((category) => category.label === defaultCategory) ?? defaultCatalogCategory;
  const [categoryValue, setCategoryValue] = useState<string>(initialCategory.label);
  const activeCategory = useMemo(
    () => catalogCategories.find((category) => category.label === categoryValue) ?? defaultCatalogCategory,
    [categoryValue]
  );
  const subcategoryValid = activeCategory.subcategories.some((subcategory) => subcategory.label === defaultSubcategory);
  const selectedSubcategory = subcategoryValid ? defaultSubcategory : "";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="category">
          Hlavní kategorie
        </label>
        <select
          id="category"
          name="category"
          required
          value={categoryValue}
          onChange={(event) => setCategoryValue(event.target.value)}
          className="mt-2 px-3 py-3"
        >
          {catalogCategories.map((category) => (
            <option key={category.label} value={category.label}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="subcategory">
          Podkategorie
        </label>
        <select id="subcategory" name="subcategory" required defaultValue={selectedSubcategory} key={categoryValue} className="mt-2 px-3 py-3">
          <option value="" disabled>
            Vyberte podkategorii
          </option>
          {activeCategory.subcategories.map((subcategory) => (
            <option key={subcategory.label} value={subcategory.label}>
              {subcategory.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
