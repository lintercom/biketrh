create table if not exists public.price_offers (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  original_price integer not null check (original_price > 0),
  proposed_price integer not null check (proposed_price > 0),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (buyer_id <> seller_id)
);

alter table public.messages
  add column if not exists price_offer_id uuid references public.price_offers(id) on delete set null;

create index if not exists price_offers_listing_created_idx on public.price_offers (listing_id, created_at desc);
create index if not exists price_offers_buyer_idx on public.price_offers (buyer_id, created_at desc);
create index if not exists price_offers_seller_idx on public.price_offers (seller_id, created_at desc);
create index if not exists messages_price_offer_idx on public.messages (price_offer_id);

drop trigger if exists price_offers_set_updated_at on public.price_offers;
create trigger price_offers_set_updated_at
before update on public.price_offers
for each row execute function public.set_updated_at();

create or replace function public.create_price_offer(p_listing_id uuid, p_proposed_price integer)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  listing_row public.listings%rowtype;
  new_offer_id uuid;
begin
  if current_user_id is null then
    raise exception 'Přihlášení je povinné.';
  end if;

  if p_proposed_price is null or p_proposed_price <= 0 then
    raise exception 'Nabídnutá cena musí být větší než 0.';
  end if;

  select * into listing_row
  from public.listings
  where id = p_listing_id;

  if not found then
    raise exception 'Inzerát neexistuje.';
  end if;

  if listing_row.status <> 'active' then
    raise exception 'Inzerát už není aktivní.';
  end if;

  if listing_row.seller_id = current_user_id then
    raise exception 'Na vlastní inzerát nelze nabídnout cenu.';
  end if;

  if p_proposed_price >= listing_row.price then
    raise exception 'Nabídka musí být nižší než původní cena.';
  end if;

  insert into public.price_offers (listing_id, buyer_id, seller_id, original_price, proposed_price, status)
  values (listing_row.id, current_user_id, listing_row.seller_id, listing_row.price, p_proposed_price, 'pending')
  returning id into new_offer_id;

  insert into public.messages (listing_id, sender_id, receiver_id, text, price_offer_id)
  values (
    listing_row.id,
    current_user_id,
    listing_row.seller_id,
    'Nabízím cenu ' || p_proposed_price::text || ' Kč místo původní ceny ' || listing_row.price::text || ' Kč.',
    new_offer_id
  );

  return new_offer_id;
end;
$$;

grant execute on function public.create_price_offer(uuid, integer) to authenticated;

create or replace function public.respond_price_offer(p_offer_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  offer_row public.price_offers%rowtype;
  response_text text;
begin
  if current_user_id is null then
    raise exception 'Přihlášení je povinné.';
  end if;

  if p_status not in ('accepted', 'rejected') then
    raise exception 'Neplatná odpověď na nabídku.';
  end if;

  select * into offer_row
  from public.price_offers
  where id = p_offer_id
  for update;

  if not found then
    raise exception 'Nabídka neexistuje.';
  end if;

  if offer_row.seller_id <> current_user_id then
    raise exception 'Na nabídku může odpovědět jen prodávající.';
  end if;

  if offer_row.status <> 'pending' then
    raise exception 'Na tuto nabídku už bylo odpovězeno.';
  end if;

  update public.price_offers
  set status = p_status
  where id = offer_row.id;

  response_text := case
    when p_status = 'accepted' then 'Nabídka ceny byla přijata.'
    else 'Nabídka ceny byla odmítnuta.'
  end;

  insert into public.messages (listing_id, sender_id, receiver_id, text, price_offer_id)
  values (offer_row.listing_id, offer_row.seller_id, offer_row.buyer_id, response_text, offer_row.id);
end;
$$;

grant execute on function public.respond_price_offer(uuid, text) to authenticated;

alter table public.price_offers enable row level security;

drop policy if exists "Offer participants read price offers" on public.price_offers;
create policy "Offer participants read price offers"
on public.price_offers for select
using (buyer_id = auth.uid() or seller_id = auth.uid());

drop policy if exists "Buyers create own price offers" on public.price_offers;
create policy "Buyers create own price offers"
on public.price_offers for insert
with check (
  buyer_id = auth.uid()
  and exists (
    select 1 from public.listings
    where listings.id = price_offers.listing_id
      and listings.seller_id = price_offers.seller_id
      and listings.seller_id <> auth.uid()
      and listings.status = 'active'
  )
);

drop policy if exists "Participants create messages" on public.messages;
create policy "Participants create messages"
on public.messages for insert
with check (
  sender_id = auth.uid()
  and (
    exists (
      select 1 from public.orders
      where orders.listing_id = messages.listing_id
        and (
          (orders.buyer_id = auth.uid() and orders.seller_id = messages.receiver_id)
          or (orders.seller_id = auth.uid() and orders.buyer_id = messages.receiver_id)
        )
        and orders.status in ('created', 'accepted', 'completed')
    )
    or exists (
      select 1 from public.price_offers
      where price_offers.listing_id = messages.listing_id
        and (
          (price_offers.buyer_id = auth.uid() and price_offers.seller_id = messages.receiver_id)
          or (price_offers.seller_id = auth.uid() and price_offers.buyer_id = messages.receiver_id)
        )
        and price_offers.status in ('pending', 'accepted')
    )
  )
);
