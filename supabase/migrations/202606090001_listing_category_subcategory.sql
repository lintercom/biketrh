alter table public.listings
  add column if not exists subcategory text not null default 'Ostatní';

update public.listings
set
  category = case
    when category ilike 'Kola%' then 'Kola'
    when category ilike 'Elektrokola%' then 'Elektrokola'
    else 'Komponenty'
  end,
  subcategory = case
    when category ilike '%Odpružení%' or category ilike '%Odpruzeni%' then 'Odpružení'
    when category ilike '%Pohon%' then 'Pohon'
    when category ilike '%Brzdy%' then 'Brzdy'
    when category ilike '%Kola a pláště%' or category ilike '%Kola a plaste%' then 'Kola a pláště'
    when category ilike '%Kokpit%' then 'Kokpit'
    when category ilike '%Sedlová část%' or category ilike '%Sedlova cast%' then 'Sedlová část'
    when category ilike '%Pedály%' or category ilike '%Pedaly%' then 'Pedály'
    when category ilike '%Elektrokola komponenty%' then 'Elektrokola komponenty'
    when category ilike '%Enduro%' then 'Enduro'
    when category ilike '%Trail%' then 'Trail'
    when category ilike '%XC%' then 'XC'
    when category ilike '%Gravel%' then 'Gravel'
    when category ilike '%MTB%' then 'MTB'
    else 'Ostatní'
  end;

alter table public.listings
  drop constraint if exists listings_category_allowed_chk,
  drop constraint if exists listings_subcategory_allowed_chk,
  drop constraint if exists listings_category_subcategory_allowed_chk;

alter table public.listings
  add constraint listings_category_allowed_chk
    check (category in ('Komponenty', 'Kola', 'Elektrokola')),
  add constraint listings_subcategory_allowed_chk
    check (char_length(subcategory) between 2 and 80),
  add constraint listings_category_subcategory_allowed_chk
    check (
      (
        category = 'Komponenty'
        and subcategory in (
          'Odpružení',
          'Pohon',
          'Brzdy',
          'Kola a pláště',
          'Kokpit',
          'Sedlová část',
          'Pedály',
          'Elektrokola komponenty',
          'Ostatní'
        )
      )
      or (
        category = 'Kola'
        and subcategory in (
          'MTB',
          'Enduro',
          'Trail',
          'XC',
          'Downhill',
          'Gravel',
          'Silniční',
          'Městská',
          'Dětská',
          'Ostatní'
        )
      )
      or (
        category = 'Elektrokola'
        and subcategory in (
          'MTB e-bike',
          'Trail e-bike',
          'Enduro e-bike',
          'XC e-bike',
          'Gravel e-bike',
          'Městské e-bike',
          'Dětské e-bike',
          'Ostatní'
        )
      )
    );

create index if not exists listings_status_category_subcategory_idx
  on public.listings (status, category, subcategory, created_at desc);

drop policy if exists "Users create own listings" on public.listings;
create policy "Users create own listings"
on public.listings for insert
with check (
  seller_id = auth.uid()
  and category in ('Komponenty', 'Kola', 'Elektrokola')
  and char_length(subcategory) between 2 and 80
);
