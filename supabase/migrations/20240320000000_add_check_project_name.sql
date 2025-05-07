-- Drop the function if it exists
drop function if exists check_project_name(text, uuid);

-- Create a function to check if a project slug is unique within an organisation
create function check_project_name(p_name text, p_org_id uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  v_exists boolean;
  v_slug text;
begin
  -- Generate the slug by removing all non-alphanumeric characters
  v_slug := regexp_replace(lower(p_name), '[^a-z0-9]', '', 'g');

  -- Check if a project with the same slug exists in the organisation
  select exists(
    select 1
    from projects
    where organisation_id = p_org_id
    and slug = v_slug
  ) into v_exists;

  return v_exists;
end;
$$; 