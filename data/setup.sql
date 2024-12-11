-- create the schema
CREATE SCHEMA cafeforwork;
GRANT USAGE ON SCHEMA cafeforwork TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA cafeforwork TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA cafeforwork TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA cafeforwork TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA cafeforwork GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA cafeforwork GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA cafeforwork GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Create the cafes table
CREATE TABLE cafeforwork.cafes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    slug TEXT UNIQUE,
    city TEXT,
    city_slug TEXT REFERENCES cafeforwork.cities(slug),
    address TEXT,
    links TEXT,
    lat_long TEXT,
    wifi_qualitity TEXT,
    seating_comfort TEXT,
    ambiance TEXT,
    food_content TEXT,
    open_hours TEXT,
    preview_image TEXT,
    processed JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC')
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = (now() AT TIME ZONE 'UTC');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_cafes_updated_at
BEFORE UPDATE ON cafeforwork.cafes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
alter table cafeforwork.cafes enable row level security;

-- Create a policy to allow anyone to insert data
create policy insert_cafe on cafeforwork.cafes
for insert
to public
with check (true);

--- Create table for cities
CREATE TABLE cafeforwork.cities (
    slug TEXT UNIQUE PRIMARY KEY,
    name TEXT,
    country TEXT,
    country_code TEXT,
    lat_long TEXT,
    preview_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC'),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'UTC')
);

-- Enable Row Level Security
alter table cafeforwork.cities enable row level security;

-- Create a policy to allow anyone to insert data
create policy insert_city on cafeforwork.cities
for insert
to public
with check (true);

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_cities_updated_at
BEFORE UPDATE ON cafeforwork.cities
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
