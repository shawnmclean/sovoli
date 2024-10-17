-- Ensure the vector extension exists, only if supported by Supabase
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a storage bucket on supabase for storing the collection images.
-- Use ON CONFLICT to handle potential duplicate bucket creation

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Enable row-level security (RLS) on the storage.objects table if not already enabled.
-- This ensures that the policies will be enforced.
alter table storage.objects enable row level security;

-- Check if the policy "Public Access Bucket Images Get" already exists before creating it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = 'Public Access Bucket Images Get'
        AND tablename = 'objects'
    ) THEN
        create policy "Public Access Bucket Images Get"
        on storage.objects for select
        using (bucket_id = 'media');
    END IF;
END $$;

-- Check if the policy "Public Access Bucket Images Post" already exists before creating it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = 'Public Access Bucket Images Post'
        AND tablename = 'objects'
    ) THEN
        create policy "Public Access Bucket Images Post"
        on storage.objects for insert
        with check (bucket_id = 'media');
    END IF;
END $$;

-- Check if the policy "Public Access Bucket Images Delete" already exists before creating it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE policyname = 'Public Access Bucket Images Delete'
        AND tablename = 'objects'
    ) THEN
        create policy "Public Access Bucket Images Delete"
        on storage.objects for delete
        using (bucket_id = 'media');
    END IF;
END $$;

-- Create function to convert author array to string in an immutable manner
-- https://stackoverflow.com/a/31213069/400861

CREATE OR REPLACE FUNCTION immutable_array_to_string(anyarray, text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT array_to_string($1, $2);
$$;