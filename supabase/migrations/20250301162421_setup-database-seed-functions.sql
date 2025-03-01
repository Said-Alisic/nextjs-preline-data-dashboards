DROP FUNCTION IF EXISTS "seedProductsTable"();
DROP FUNCTION IF EXISTS "seedOrdersTable"();
DROP FUNCTION IF EXISTS "seedRatingsTable"();

-- Create a function to seed the "products" table with 10 products
CREATE OR REPLACE FUNCTION "seedProductsTable"()
RETURNS void AS $$
DECLARE
    product_names VARCHAR(250)[] := ARRAY[
        'Basic Product', 
        'Premium Product', 
        'Startup Product', 
        'Enterprise Product', 
        'Micro Product', 
        'Scaleup Product', 
        'Analytics Product', 
        'Hobby Product', 
        'Freelance Product', 
        'Agency Product'
    ];
    min_price INT := 10000;
    max_price INT := 200000;
    product_name VARCHAR(250);
BEGIN
    -- Loop through each product name in the array
    FOREACH product_name IN ARRAY product_names LOOP
        -- Check if a product with this name already exists
        IF NOT EXISTS (SELECT 1 FROM "products" WHERE "name" = product_name) THEN
            -- Insert the product with a random price between 10,000 and 200,000 cents
            INSERT INTO "products" ("name", "priceInCents")
            VALUES (product_name, min_price + floor(random() * (max_price - min_price + 1))::INT);
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;



-- Create a function to seed the "orders" and "orderProducts" tables
CREATE OR REPLACE FUNCTION "seedOrdersTable"()
RETURNS void AS $$
DECLARE
    country_codes VARCHAR(3)[] := ARRAY['DK', 'SE', 'AU', 'KR', 'US', 'UK', 'FR', 'TH', 'FI', 'GR', 'JP', 'NZ'];
    statuses VARCHAR(20)[] := ARRAY['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    order_id UUID;
    total_price INT;
    N INT;
    created_at TIMESTAMP WITH TIME ZONE;
    country_code VARCHAR(3);
    status VARCHAR(20);
BEGIN
    -- Seed 500 orders for 2024
    FOR i IN 1..500 LOOP
        -- Select a random country code
        country_code := country_codes[floor(random() * array_length(country_codes, 1) + 1)];
        -- Select a random status
        status := statuses[floor(random() * array_length(statuses, 1) + 1)];
        -- Generate a random timestamp for 2024
        created_at := '2024-01-01 00:00:00'::timestamp + random() * ('2025-01-01 00:00:00'::timestamp - '2024-01-01 00:00:00'::timestamp);
        -- Insert the order with a placeholder total price
        INSERT INTO "orders" ("countryCode", "totalPriceInCents", "status", "createdAt", "updatedAt")
        VALUES (country_code, 0, status, created_at, created_at)
        RETURNING "id" INTO order_id;
        -- Determine a random number of products (1 to 5)
        N := 1 + floor(random() * 5)::INT;
        -- Insert N random products with random quantities into orderProducts
        INSERT INTO "orderProducts" ("productId", "orderId", "quantity")
        SELECT p."id", order_id, 1 + floor(random() * 10)::INT
        FROM "products" p
        ORDER BY random()
        LIMIT N;
        -- Calculate the total price for the order
        SELECT SUM(p."priceInCents" * op."quantity") INTO total_price
        FROM "orderProducts" op
        JOIN "products" p ON op."productId" = p."id"
        WHERE op."orderId" = order_id;
        -- Update the order with the calculated total price
        UPDATE "orders"
        SET "totalPriceInCents" = total_price
        WHERE "id" = order_id;
    END LOOP;

    -- Seed 500 orders for 2025
    FOR i IN 1..500 LOOP
        -- Select a random country code
        country_code := country_codes[floor(random() * array_length(country_codes, 1) + 1)];
        -- Select a random status
        status := statuses[floor(random() * array_length(statuses, 1) + 1)];
        -- Generate a random timestamp for 2025
        created_at := '2025-01-01 00:00:00'::timestamp + random() * ('2026-01-01 00:00:00'::timestamp - '2025-01-01 00:00:00'::timestamp);
        -- Insert the order with a placeholder total price
        INSERT INTO "orders" ("countryCode", "totalPriceInCents", "status", "createdAt", "updatedAt")
        VALUES (country_code, 0, status, created_at, created_at)
        RETURNING "id" INTO order_id;
        -- Determine a random number of products (1 to 5)
        N := 1 + floor(random() * 5)::INT;
        -- Insert N random products with random quantities into orderProducts
        INSERT INTO "orderProducts" ("productId", "orderId", "quantity")
        SELECT p."id", order_id, 1 + floor(random() * 10)::INT
        FROM "products" p
        ORDER BY random()
        LIMIT N;
        -- Calculate the total price for the order
        SELECT SUM(p."priceInCents" * op."quantity") INTO total_price
        FROM "orderProducts" op
        JOIN "products" p ON op."productId" = p."id"
        WHERE op."orderId" = order_id;
        -- Update the order with the calculated total price
        UPDATE "orders"
        SET "totalPriceInCents" = total_price
        WHERE "id" = order_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;



-- Create a function to seed the "productRatings" table with 100 ratings per product
CREATE OR REPLACE FUNCTION "seedRatingsTable"()
RETURNS void AS $$
BEGIN
    -- Insert 100 random ratings (1 to 5) for each product
    INSERT INTO "productRatings" ("id", "productId", "rating")
    SELECT uuid_generate_v4(), p."id", 1 + floor(random() * 5)::INT
    FROM "products" p
    CROSS JOIN generate_series(1, 100);
END;
$$ LANGUAGE plpgsql;
