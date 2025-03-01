-- Enable uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create "products" table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(250) NOT NULL,
  priceInCents INTEGER NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create "orders" table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  countryCode VARCHAR(3) NOT NULL,
  totalPriceInCents INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create "orderProducts" table (renamed from "order_products")
CREATE TABLE orderProducts (
  productId UUID NOT NULL,
  orderId UUID NOT NULL,
  quantity INTEGER NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (productId, orderId),
  FOREIGN KEY (productId) REFERENCES products(id),
  FOREIGN KEY (orderId) REFERENCES orders(id)
);

-- Create the "productRatings" table with numeric rating (enum removed)
CREATE TABLE productRatings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  productId UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (productId) REFERENCES products(id)
);