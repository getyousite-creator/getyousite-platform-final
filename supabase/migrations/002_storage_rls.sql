-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create bucket if it doesn't exist (this is usually done via API/Dashboard, but good to have in SQL for reference)
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true) ON CONFLICT DO NOTHING;

-- POLICY 1: Allow authenticated users to upload files to their own folder
-- Path convention: {user_id}/{filename}
CREATE POLICY "Users can upload their own assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- POLICY 2: Allow authenticated users to view their own assets (and public can view if we allow public stores)
-- For now, we allow public read access because the sites are meant to be public
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-assets');

-- POLICY 3: Allow users to update/delete their own assets
CREATE POLICY "Users can update their own assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'site-assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
