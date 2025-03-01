-- Enable RLS for "products" table
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;

-- Enable RLS for "orders" table
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;

-- Enable RLS for "orderProducts" table
ALTER TABLE "orderProducts" ENABLE ROW LEVEL SECURITY;

-- Enable RLS for "productRatings" table
ALTER TABLE "productRatings" ENABLE ROW LEVEL SECURITY;