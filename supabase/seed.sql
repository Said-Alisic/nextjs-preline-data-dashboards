-- Execute the function to seed the products
SELECT "seedProductsTable"();

-- Optionally drop the function after execution (depending on your migration setup)
DROP FUNCTION IF EXISTS "seedProductsTable"();

-- Execute the function to populate the tables
SELECT "seedOrdersTable"();

-- Optionally drop the function after execution
DROP FUNCTION IF EXISTS "seedOrdersTable"();

-- Execute the function to seed the ratings
SELECT "seedRatingsTable"();

-- Optionally drop the function after execution
DROP FUNCTION IF EXISTS "seedRatingsTable"();