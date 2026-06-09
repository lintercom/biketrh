alter table public.listings
  drop constraint if exists listings_category_allowed_chk,
  drop constraint if exists listings_subcategory_allowed_chk,
  drop constraint if exists listings_category_subcategory_allowed_chk;

update public.listings
set
  category = case
    when category = 'Oblečení a obuv' then 'Oblečení a obuv'
    when category = 'Doplňky a příslušenství' then 'Doplňky a příslušenství'
    else 'Komponenty'
  end,
  subcategory = case
    when subcategory in ('Helmy', 'Dětské sedačky a vozíky', 'Cyklocomputery a GPS', 'Brýle', 'Ostatní příslušenství',
                         'Chrániče a páteřáky', 'Brašny a tašky', 'Nosiče a zahrádky kol',
                         'Cyklonářadí a montážní sady', 'Nosiče na kolo', 'Pumpy', 'Košíky a lahve',
                         'Odrazky a světla', 'Batohy a ledvinky', 'Obaly na kola',
                         'Příslušenství k elektrokolům', 'Blatníky, kryty', 'Dárky pro cyklisty',
                         'Výživa', 'Zámky', 'Polepy a ochranné fólie') then subcategory
    when subcategory in ('Tretry a obuv', 'Dresy', 'Kalhoty, kraťasy a sukně', 'Bundy', 'Rukavice',
                         'Vesty', 'Návleky', 'Funkční prádlo', 'Čepice a čelenky', 'Pláštěnky na kola') then subcategory
    when subcategory in ('Zapletená kola', 'Kliky a převodníky', 'Sedla', 'Vidlice', 'Pláště, duše, galusky',
                         'Brzdy, páky', 'Ráfky, výplety', 'Řídítka, rohy', 'Rámy', 'Sedlovky',
                         'Tlumiče', 'Kazety a řetězy', 'Představce', 'Sady', 'Náboje a osy',
                         'Pedály', 'Přehazovačky', 'Ostatní komponenty', 'Řazení',
                         'Komponenty na elektrokola', 'Měřiče výkonu (wattmetry)', 'Gripy a omotávky',
                         'Středová složení', 'Přesmykače', 'Hlavová složení', 'Bowdeny, lanka') then subcategory
    when subcategory = 'Odpružení' then 'Vidlice'
    when subcategory = 'Pohon' then 'Sady'
    when subcategory = 'Brzdy' then 'Brzdy, páky'
    when subcategory = 'Kola a pláště' then 'Zapletená kola'
    when subcategory = 'Kokpit' then 'Řídítka, rohy'
    when subcategory = 'Sedlová část' then 'Sedlovky'
    when subcategory = 'Elektrokola komponenty' then 'Komponenty na elektrokola'
    when subcategory in ('MTB', 'Enduro', 'Trail', 'XC', 'Downhill', 'Gravel', 'Silniční', 'Městská', 'Dětská',
                         'MTB e-bike', 'Trail e-bike', 'Enduro e-bike', 'XC e-bike', 'Gravel e-bike',
                         'Městské e-bike', 'Dětské e-bike') then 'Ostatní komponenty'
    when subcategory = 'Ostatní' then 'Ostatní komponenty'
    else 'Ostatní komponenty'
  end;

alter table public.listings
  alter column category set default 'Doplňky a příslušenství',
  alter column subcategory set default 'Ostatní příslušenství';

alter table public.listings
  add constraint listings_category_allowed_chk
    check (category in ('Doplňky a příslušenství', 'Komponenty', 'Oblečení a obuv')),
  add constraint listings_subcategory_allowed_chk
    check (char_length(subcategory) between 2 and 80),
  add constraint listings_category_subcategory_allowed_chk
    check (
      (
        category = 'Doplňky a příslušenství'
        and subcategory in (
          'Helmy',
          'Dětské sedačky a vozíky',
          'Cyklocomputery a GPS',
          'Brýle',
          'Ostatní příslušenství',
          'Chrániče a páteřáky',
          'Brašny a tašky',
          'Nosiče a zahrádky kol',
          'Cyklonářadí a montážní sady',
          'Nosiče na kolo',
          'Pumpy',
          'Košíky a lahve',
          'Odrazky a světla',
          'Batohy a ledvinky',
          'Obaly na kola',
          'Příslušenství k elektrokolům',
          'Blatníky, kryty',
          'Dárky pro cyklisty',
          'Výživa',
          'Zámky',
          'Polepy a ochranné fólie'
        )
      )
      or (
        category = 'Komponenty'
        and subcategory in (
          'Zapletená kola',
          'Kliky a převodníky',
          'Sedla',
          'Vidlice',
          'Pláště, duše, galusky',
          'Brzdy, páky',
          'Ráfky, výplety',
          'Řídítka, rohy',
          'Rámy',
          'Sedlovky',
          'Tlumiče',
          'Kazety a řetězy',
          'Představce',
          'Sady',
          'Náboje a osy',
          'Pedály',
          'Přehazovačky',
          'Ostatní komponenty',
          'Řazení',
          'Komponenty na elektrokola',
          'Měřiče výkonu (wattmetry)',
          'Gripy a omotávky',
          'Středová složení',
          'Přesmykače',
          'Hlavová složení',
          'Bowdeny, lanka'
        )
      )
      or (
        category = 'Oblečení a obuv'
        and subcategory in (
          'Tretry a obuv',
          'Dresy',
          'Kalhoty, kraťasy a sukně',
          'Bundy',
          'Rukavice',
          'Vesty',
          'Návleky',
          'Funkční prádlo',
          'Čepice a čelenky',
          'Pláštěnky na kola'
        )
      )
    );

drop policy if exists "Users create own listings" on public.listings;
create policy "Users create own listings"
on public.listings for insert
with check (
  seller_id = auth.uid()
  and category in ('Doplňky a příslušenství', 'Komponenty', 'Oblečení a obuv')
  and char_length(subcategory) between 2 and 80
);
