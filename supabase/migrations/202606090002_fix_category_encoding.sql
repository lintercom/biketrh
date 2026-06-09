update public.listings
set subcategory = case subcategory
  when 'OdpruĹľenĂ­' then 'Odpružení'
  when 'Kola a plĂˇĹˇtÄ›' then 'Kola a pláště'
  when 'SedlovĂˇ ÄŤĂˇst' then 'Sedlová část'
  when 'PedĂˇly' then 'Pedály'
  when 'OstatnĂ­' then 'Ostatní'
  when 'SilniÄŤnĂ­' then 'Silniční'
  when 'MÄ›stskĂˇ' then 'Městská'
  when 'DÄ›tskĂˇ' then 'Dětská'
  when 'MÄ›stskĂ© e-bike' then 'Městské e-bike'
  when 'DÄ›tskĂ© e-bike' then 'Dětské e-bike'
  else subcategory
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
