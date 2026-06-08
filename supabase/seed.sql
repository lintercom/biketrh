insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'martin@biketrh.test',
    crypt('biketrh123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Martin Švec","city":"Liberec"}',
    false
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'tereza@biketrh.test',
    crypt('biketrh123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Tereza Horáková","city":"Brno"}',
    false
  )
on conflict (id) do nothing;

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    gen_random_uuid(),
    '11111111-1111-4111-8111-111111111111',
    'martin@biketrh.test',
    jsonb_build_object('sub', '11111111-1111-4111-8111-111111111111', 'email', 'martin@biketrh.test'),
    'email',
    now(),
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    '22222222-2222-4222-8222-222222222222',
    'tereza@biketrh.test',
    jsonb_build_object('sub', '22222222-2222-4222-8222-222222222222', 'email', 'tereza@biketrh.test'),
    'email',
    now(),
    now(),
    now()
  )
on conflict (provider, provider_id) do nothing;

insert into public.profiles (id, display_name, city, rating_average, rating_count)
values
  ('11111111-1111-4111-8111-111111111111', 'Martin Švec', 'Liberec', 4.8, 12),
  ('22222222-2222-4222-8222-222222222222', 'Tereza Horáková', 'Brno', 4.6, 8)
on conflict (id) do update
set display_name = excluded.display_name,
    city = excluded.city,
    rating_average = excluded.rating_average,
    rating_count = excluded.rating_count;

insert into public.listings (id, seller_id, title, description, price, category, condition, location, status, created_at)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111',
    'Vidlice Fox 36 Factory',
    'Vzduchová vidlice po servisu, osa 15x110 Boost, zdvih 160 mm. Běžné kosmetické stopy, nohy bez škrábanců.',
    16900,
    'Komponenty',
    'good',
    'Liberec',
    'active',
    now() - interval '1 hour'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    '22222222-2222-4222-8222-222222222222',
    'Tlumič RockShox Super Deluxe',
    'Rozměr 230x65 mm, sundaný z endura po přechodu na pružinu. Bez vůlí, funkční lockout.',
    6400,
    'Komponenty',
    'good',
    'Brno',
    'active',
    now() - interval '2 hours'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    '11111111-1111-4111-8111-111111111111',
    'Brzdy Shimano XT',
    'Přední a zadní brzda včetně kotoučů 180/203 mm. Desky ještě přibližně 70 %, odvzdušněno před měsícem.',
    5200,
    'Komponenty',
    'used',
    'Jablonec nad Nisou',
    'active',
    now() - interval '3 hours'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
    '22222222-2222-4222-8222-222222222222',
    'Zapletená kola DT Swiss',
    'Trailová kola 29", náboje 350, ráfky XM 481, ořech Shimano Micro Spline. Rovná, bez větších ran.',
    11900,
    'Komponenty',
    'like_new',
    'Brno',
    'active',
    now() - interval '4 hours'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5',
    '11111111-1111-4111-8111-111111111111',
    'Sedlovka OneUp Dropper',
    'Průměr 31.6 mm, zdvih 180 mm. Chod plynulý, včetně páčky a bowdenu.',
    3900,
    'Komponenty',
    'good',
    'Liberec',
    'active',
    now() - interval '5 hours'
  )
on conflict (id) do nothing;

insert into public.listing_images (listing_id, image_url, sort_order)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=85', 0),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1200&q=85', 0),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1200&q=85', 0),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 'https://images.unsplash.com/photo-1506316940527-4d1c138978a0?auto=format&fit=crop&w=1200&q=85', 0),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5', 'https://images.unsplash.com/photo-1525107537758-84a35d0a96f4?auto=format&fit=crop&w=1200&q=85', 0)
on conflict (listing_id, sort_order) do nothing;
