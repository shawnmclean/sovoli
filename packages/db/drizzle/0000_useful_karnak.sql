-- Custom SQL migration file, put you code below! --

CREATE EXTENSION vector;

-- Create a storage bucket on supabase for storing the collection images.

insert into storage.buckets (id, name, public)
values ('collection-images', 'collection-images', true);