-- Create project_types table
create table if not exists project_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create project_type_routes table for many-to-many relationship
create table if not exists project_type_routes (
  id uuid primary key default gen_random_uuid(),
  project_type_id uuid not null references project_types(id) on delete cascade,
  route_id uuid not null references routes(id) on delete cascade,
  nav_order integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(project_type_id, route_id)
);

-- Add project_type_id to projects table
alter table projects add column if not exists project_type_id uuid references project_types(id);

-- Insert some default project types
insert into project_types (name, description) values
  ('telecom-billing', 'Telecommunications Billing Software'),
  ('web-app', 'Web Application'),
  ('mobile-app', 'Mobile Application'),
  ('saas', 'SaaS Platform'),
  ('ecommerce', 'E-commerce'),
  ('api', 'API Development'),
  ('cms', 'Content Management System'),
  ('marketplace', 'Marketplace Platform'),
  ('dashboard', 'Analytics Dashboard'),
  ('other', 'Other');

-- Create function to get routes for a project type
create or replace function get_project_type_routes(p_project_type_id uuid)
returns table (
  id uuid,
  path text,
  nav_label text,
  nav_group_id uuid,
  nav_group_name text,
  nav_group_label text,
  nav_group_order integer,
  nav_order integer,
  lucide_icon text,
  parent_id uuid
) language plpgsql security definer as $$
begin
  return query
  select 
    r.id,
    r.path,
    r.nav_label,
    r.nav_group_id,
    ng.name as nav_group_name,
    ng.label as nav_group_label,
    ng.nav_order as nav_group_order,
    ptr.nav_order,
    r.lucide_icon,
    r.parent_id
  from project_type_routes ptr
  join routes r on r.id = ptr.route_id
  left join nav_groups ng on ng.id = r.nav_group_id
  where ptr.project_type_id = p_project_type_id
  order by ng.nav_order, ptr.nav_order;
end;
$$;

-- Add action for organisation settings access
insert into actions (name, description) values 
  ('access_organisation_settings', 'Access organisation-level settings page')
on conflict (name) do nothing; 