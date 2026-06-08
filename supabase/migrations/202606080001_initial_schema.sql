create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  city text not null default '',
  avatar_url text,
  rating_average numeric(3, 2) not null default 0 check (rating_average >= 0 and rating_average <= 5),
  rating_count integer not null default 0 check (rating_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  description text not null check (char_length(description) between 10 and 3000),
  price integer not null check (price >= 0),
  category text not null default 'Komponenty',
  condition text not null check (condition in ('new', 'like_new', 'good', 'used', 'for_parts')),
  location text not null check (char_length(location) between 2 and 120),
  status text not null default 'active' check (status in ('active', 'reserved', 'sold', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (listing_id, sort_order)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'created' check (status in ('created', 'accepted', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (buyer_id <> seller_id)
);

create unique index if not exists orders_one_open_per_listing_idx
  on public.orders (listing_id)
  where status in ('created', 'accepted');

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  text text not null check (char_length(text) between 1 and 2000),
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  check (sender_id <> receiver_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewed_user_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  text text check (text is null or char_length(text) <= 1000),
  created_at timestamptz not null default now(),
  unique (order_id, reviewer_id),
  check (reviewer_id <> reviewed_user_id)
);

create index if not exists listings_seller_idx on public.listings (seller_id);
create index if not exists listings_status_created_idx on public.listings (status, created_at desc);
create index if not exists listing_images_listing_idx on public.listing_images (listing_id, sort_order);
create index if not exists orders_buyer_idx on public.orders (buyer_id, updated_at desc);
create index if not exists orders_seller_idx on public.orders (seller_id, updated_at desc);
create index if not exists messages_listing_created_idx on public.messages (listing_id, created_at);
create index if not exists reviews_reviewed_user_idx on public.reviews (reviewed_user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, city)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1), 'Nový uživatel'),
    coalesce(new.raw_user_meta_data ->> 'city', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.refresh_profile_rating(profile_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  next_average numeric(3, 2);
  next_count integer;
begin
  select coalesce(avg(rating)::numeric(3, 2), 0), count(*)
    into next_average, next_count
  from public.reviews
  where reviewed_user_id = profile_id;

  update public.profiles
  set rating_average = next_average,
      rating_count = next_count,
      updated_at = now()
  where id = profile_id;
end;
$$;

create or replace function public.on_review_changed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.refresh_profile_rating(old.reviewed_user_id);
    return old;
  end if;

  perform public.refresh_profile_rating(new.reviewed_user_id);

  if tg_op = 'UPDATE' and old.reviewed_user_id is distinct from new.reviewed_user_id then
    perform public.refresh_profile_rating(old.reviewed_user_id);
  end if;

  return new;
end;
$$;

drop trigger if exists reviews_refresh_rating on public.reviews;
create trigger reviews_refresh_rating
after insert or update or delete on public.reviews
for each row execute function public.on_review_changed();

create or replace function public.create_order_and_reserve(p_listing_id uuid, p_message text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  listing_row public.listings%rowtype;
  new_order_id uuid;
begin
  if current_user_id is null then
    raise exception 'Přihlášení je povinné.';
  end if;

  select * into listing_row
  from public.listings
  where id = p_listing_id
  for update;

  if not found then
    raise exception 'Inzerát neexistuje.';
  end if;

  if listing_row.status <> 'active' then
    raise exception 'Inzerát už není aktivní.';
  end if;

  if listing_row.seller_id = current_user_id then
    raise exception 'Na vlastní inzerát nelze vytvořit objednávku.';
  end if;

  insert into public.orders (listing_id, buyer_id, seller_id, status)
  values (listing_row.id, current_user_id, listing_row.seller_id, 'created')
  returning id into new_order_id;

  update public.listings
  set status = 'reserved'
  where id = listing_row.id;

  if nullif(trim(coalesce(p_message, '')), '') is not null then
    insert into public.messages (listing_id, sender_id, receiver_id, text)
    values (listing_row.id, current_user_id, listing_row.seller_id, trim(p_message));
  end if;

  return new_order_id;
end;
$$;

grant execute on function public.create_order_and_reserve(uuid, text) to authenticated;

create or replace function public.set_order_status(p_order_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  order_row public.orders%rowtype;
begin
  if current_user_id is null then
    raise exception 'Přihlášení je povinné.';
  end if;

  select * into order_row
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'Objednávka neexistuje.';
  end if;

  if current_user_id not in (order_row.buyer_id, order_row.seller_id) then
    raise exception 'K objednávce nemáte přístup.';
  end if;

  if p_status = 'accepted' then
    if current_user_id <> order_row.seller_id or order_row.status <> 'created' then
      raise exception 'Objednávku nelze přijmout.';
    end if;
  elsif p_status = 'cancelled' then
    if order_row.status not in ('created', 'accepted') then
      raise exception 'Objednávku nelze zrušit.';
    end if;
  elsif p_status = 'completed' then
    if order_row.status not in ('created', 'accepted') then
      raise exception 'Objednávku nelze dokončit.';
    end if;
  else
    raise exception 'Neplatný stav objednávky.';
  end if;

  update public.orders
  set status = p_status
  where id = order_row.id;

  if p_status = 'completed' then
    update public.listings set status = 'sold' where id = order_row.listing_id;
  elsif p_status = 'cancelled' then
    update public.listings
    set status = 'active'
    where id = order_row.listing_id and status = 'reserved';
  end if;
end;
$$;

grant execute on function public.set_order_status(uuid, text) to authenticated;

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles are public"
on public.profiles for select
using (true);

drop policy if exists "Users create own profile" on public.profiles;
create policy "Users create own profile"
on public.profiles for insert
with check (id = auth.uid());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Active listings are public" on public.listings;
create policy "Active listings are public"
on public.listings for select
using (
  status = 'active'
  or seller_id = auth.uid()
  or exists (
    select 1 from public.orders
    where orders.listing_id = listings.id
      and (orders.buyer_id = auth.uid() or orders.seller_id = auth.uid())
  )
);

drop policy if exists "Users create own listings" on public.listings;
create policy "Users create own listings"
on public.listings for insert
with check (seller_id = auth.uid() and category = 'Komponenty');

drop policy if exists "Users update own listings" on public.listings;
create policy "Users update own listings"
on public.listings for update
using (seller_id = auth.uid())
with check (seller_id = auth.uid());

drop policy if exists "Visible listing images are public" on public.listing_images;
create policy "Visible listing images are public"
on public.listing_images for select
using (
  exists (
    select 1 from public.listings
    where listings.id = listing_images.listing_id
      and (
        listings.status = 'active'
        or listings.seller_id = auth.uid()
        or exists (
          select 1 from public.orders
          where orders.listing_id = listings.id
            and (orders.buyer_id = auth.uid() or orders.seller_id = auth.uid())
        )
      )
  )
);

drop policy if exists "Sellers create listing images" on public.listing_images;
create policy "Sellers create listing images"
on public.listing_images for insert
with check (
  exists (
    select 1 from public.listings
    where listings.id = listing_images.listing_id
      and listings.seller_id = auth.uid()
  )
);

drop policy if exists "Sellers update listing images" on public.listing_images;
create policy "Sellers update listing images"
on public.listing_images for update
using (
  exists (
    select 1 from public.listings
    where listings.id = listing_images.listing_id
      and listings.seller_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.listings
    where listings.id = listing_images.listing_id
      and listings.seller_id = auth.uid()
  )
);

drop policy if exists "Sellers delete listing images" on public.listing_images;
create policy "Sellers delete listing images"
on public.listing_images for delete
using (
  exists (
    select 1 from public.listings
    where listings.id = listing_images.listing_id
      and listings.seller_id = auth.uid()
  )
);

drop policy if exists "Order participants read orders" on public.orders;
create policy "Order participants read orders"
on public.orders for select
using (buyer_id = auth.uid() or seller_id = auth.uid());

drop policy if exists "Buyers create orders" on public.orders;
create policy "Buyers create orders"
on public.orders for insert
with check (
  buyer_id = auth.uid()
  and seller_id <> auth.uid()
  and exists (
    select 1 from public.listings
    where listings.id = orders.listing_id
      and listings.seller_id = orders.seller_id
      and listings.status = 'active'
  )
);

drop policy if exists "Order participants update orders" on public.orders;
create policy "Order participants update orders"
on public.orders for update
using (buyer_id = auth.uid() or seller_id = auth.uid())
with check (buyer_id = auth.uid() or seller_id = auth.uid());

drop policy if exists "Participants read messages" on public.messages;
create policy "Participants read messages"
on public.messages for select
using (sender_id = auth.uid() or receiver_id = auth.uid());

drop policy if exists "Participants create messages" on public.messages;
create policy "Participants create messages"
on public.messages for insert
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.orders
    where orders.listing_id = messages.listing_id
      and (
        (orders.buyer_id = auth.uid() and orders.seller_id = messages.receiver_id)
        or (orders.seller_id = auth.uid() and orders.buyer_id = messages.receiver_id)
      )
      and orders.status in ('created', 'accepted', 'completed')
  )
);

drop policy if exists "Receivers mark messages read" on public.messages;
create policy "Receivers mark messages read"
on public.messages for update
using (receiver_id = auth.uid())
with check (receiver_id = auth.uid());

drop policy if exists "Reviews are public" on public.reviews;
create policy "Reviews are public"
on public.reviews for select
using (true);

drop policy if exists "Participants review completed orders" on public.reviews;
create policy "Participants review completed orders"
on public.reviews for insert
with check (
  reviewer_id = auth.uid()
  and exists (
    select 1 from public.orders
    where orders.id = reviews.order_id
      and orders.status = 'completed'
      and (
        (orders.buyer_id = auth.uid() and orders.seller_id = reviews.reviewed_user_id)
        or (orders.seller_id = auth.uid() and orders.buyer_id = reviews.reviewed_user_id)
      )
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Listing images are public" on storage.objects;
create policy "Listing images are public"
on storage.objects for select
using (bucket_id = 'listing-images');

drop policy if exists "Users upload own listing images" on storage.objects;
create policy "Users upload own listing images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'listing-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users update own listing images" on storage.objects;
create policy "Users update own listing images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'listing-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'listing-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users delete own listing images" on storage.objects;
create policy "Users delete own listing images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'listing-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
