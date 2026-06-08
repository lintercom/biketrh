# BikeTrh MVP

BikeTrh MVP je mobil-first marketplace pro nákup a prodej cyklo komponentů z druhé ruky. UX je záměrně jednoduché: rychlé vložení inzerátu, prohlížení nabídek, rezervace přes tlačítko „Mám zájem“, zprávy vázané na konkrétní inzerát a hodnocení po dokončeném obchodu.

## Technologie

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage

## Instalace

```bash
npm install
npm run dev
```

Aplikace poběží na `http://localhost:3000`.

Bez Supabase proměnných aplikace zobrazí ukázkové inzeráty, ale přihlášení, vkládání inzerátů, objednávky a zprávy vyžadují Supabase projekt.

## Env proměnné

Vytvořte soubor `.env` podle `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Hodnoty najdete v Supabase Dashboardu v `Project Settings` -> `API`. Aplikace podporuje i starší název `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Supabase projekt

1. Vytvořte nový Supabase projekt.
2. V `Authentication` ponechte zapnuté email/password přihlášení.
3. Spusťte SQL migraci ze souboru `supabase/migrations/202606080001_initial_schema.sql`.
4. Migrace vytvoří tabulky, indexy, RLS politiky, RPC funkce a veřejný Storage bucket `listing-images`.
5. Volitelně spusťte `supabase/seed.sql` pro demo účty a ukázkové inzeráty.

Demo účty v seedu:

- `martin@biketrh.test` / `biketrh123`
- `tereza@biketrh.test` / `biketrh123`

## Lokální Supabase

Pokud používáte Supabase CLI:

```bash
supabase start
supabase db reset
```

Potom nastavte `.env` na lokální hodnoty z výstupu Supabase CLI.

## Databázový model

MVP používá tabulky:

- `profiles`
- `listings`
- `listing_images`
- `orders`
- `messages`
- `reviews`

Kategorie je v MVP automaticky `Komponenty`. Sloupec `category` zůstává textový, takže další kategorie lze přidat bez změny databázového modelu.

## Hlavní stránky

- `/` úvodní stránka
- `/inzeraty` výpis inzerátů
- `/inzeraty/[id]` detail inzerátu a akce „Mám zájem“
- `/pridat-inzerat` vložení inzerátu
- `/prihlaseni` přihlášení
- `/registrace` registrace
- `/profil` vlastní profil
- `/uzivatel/[id]` veřejný profil
- `/moje-inzeraty` správa vlastních inzerátů
- `/moje-objednavky` přehled nákupů a prodejů
- `/objednavky/[id]` detail objednávky
- `/zpravy/[listingId]` komunikace k inzerátu

## Struktura projektu

```text
src/app                 Next.js routy a server actions
src/components          Sdílené UI komponenty
src/lib                 Data vrstva, formátování, typy, Supabase klienti
supabase/migrations     SQL migrace
supabase/seed.sql       Ukázková data
```

## Kontrola

```bash
npm run typecheck
npm run lint
npm run build
```

## Záměrné limity MVP

MVP neobsahuje online platby, escrow, dopravu, reklamace, aukce, wishlist, administraci, push notifikace ani chat mimo konkrétní inzerát.
