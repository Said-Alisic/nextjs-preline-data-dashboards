-- Create the RPC function
CREATE OR REPLACE FUNCTION "getIndividualProductStats"(
    "startDate" TIMESTAMP WITH TIME ZONE,
    "endDate" TIMESTAMP WITH TIME ZONE,
    "comparison" BOOLEAN
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    -- Calculate the previous period's start and end dates
    prev_start_date TIMESTAMP WITH TIME ZONE := "startDate" - INTERVAL '1 year';
    prev_end_date TIMESTAMP WITH TIME ZONE := "endDate" - INTERVAL '1 year';
BEGIN
    -- Build the JSON response
    result := json_build_object(
        'function', 'getIndividualProductStats',
        'data', (
            -- Current period data with previous period metrics included
            SELECT COALESCE(json_agg(json_build_object(
                'name', p."name",
                'totalProductsSold', COALESCE(curr_data.total_quantity, 0),
                'totalOrderCount', COALESCE(curr_data.order_count, 0),
                'totalPriceInCents', COALESCE(curr_data.total_price, 0),
                'medianPriceInCents', COALESCE(curr_data.median_price, 0),
                'medianNumberOfProductsPerOrder', COALESCE(curr_data.median_quantity, 0),
                'prevTotalProductsSold', CASE
                    WHEN "comparison" AND prev_data.total_quantity IS NOT NULL THEN COALESCE(prev_data.total_quantity, 0)
                    ELSE 0
                END,
                'prevTotalOrderCount', CASE
                    WHEN "comparison" AND prev_data.order_count IS NOT NULL THEN COALESCE(prev_data.order_count, 0)
                    ELSE 0
                END,
                'prevTotalPriceInCents', CASE
                    WHEN "comparison" AND prev_data.total_price IS NOT NULL THEN COALESCE(prev_data.total_price, 0)
                    ELSE 0
                END,
                'prevMedianPriceInCents', CASE
                    WHEN "comparison" AND prev_data.median_price IS NOT NULL THEN COALESCE(prev_data.median_price, 0)
                    ELSE 0
                END,
                'prevMedianNumberOfProductsPerOrder', CASE
                    WHEN "comparison" AND prev_data.median_quantity IS NOT NULL THEN COALESCE(prev_data.median_quantity, 0)
                    ELSE 0
                END
            )), '[]'::json)
            FROM "products" p
            -- Current period data
            LEFT JOIN (
                SELECT 
                    op."productId",
                    SUM(op."quantity") AS total_quantity,
                    COUNT(DISTINCT op."orderId") AS order_count,
                    SUM(op."quantity" * p_inner."priceInCents") AS total_price,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (op."quantity" * p_inner."priceInCents")) AS median_price,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY op."quantity") AS median_quantity
                FROM "orderProducts" op
                JOIN "orders" o ON op."orderId" = o."id"
                JOIN "products" p_inner ON op."productId" = p_inner."id"
                WHERE o."status" = 'delivered'
                  AND o."createdAt" >= "startDate"
                  AND o."createdAt" <= "endDate"
                GROUP BY op."productId"
            ) curr_data ON p."id" = curr_data."productId"
            -- Previous period data (only if comparison = TRUE)
            LEFT JOIN (
                SELECT 
                    op."productId",
                    SUM(op."quantity") AS total_quantity,
                    COUNT(DISTINCT op."orderId") AS order_count,
                    SUM(op."quantity" * p_inner."priceInCents") AS total_price,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (op."quantity" * p_inner."priceInCents")) AS median_price,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY op."quantity") AS median_quantity
                FROM "orderProducts" op
                JOIN "orders" o ON op."orderId" = o."id"
                JOIN "products" p_inner ON op."productId" = p_inner."id"
                WHERE o."status" = 'delivered'
                  AND o."createdAt" >= prev_start_date
                  AND o."createdAt" <= prev_end_date
                GROUP BY op."productId"
            ) prev_data ON p."id" = prev_data."productId"
        ),
        'comparisonData', (
            -- Comparison data (previous period) only if comparison = TRUE
            SELECT COALESCE(json_agg(json_build_object(
                'name', p."name",
                'totalProductsSold', COALESCE(prev_data.total_quantity, 0),
                'totalOrderCount', COALESCE(prev_data.order_count, 0),
                'totalPriceInCents', COALESCE(prev_data.total_price, 0),
                'medianPriceInCents', COALESCE(prev_data.median_price, 0),
                'medianNumberOfProductsPerOrder', COALESCE(prev_data.median_quantity, 0)
            )) FILTER (WHERE "comparison" = TRUE), '[]'::json)
            FROM "products" p
            LEFT JOIN (
                SELECT 
                    op."productId",
                    SUM(op."quantity") AS total_quantity,
                    COUNT(DISTINCT op."orderId") AS order_count,
                    SUM(op."quantity" * p_inner."priceInCents") AS total_price,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (op."quantity" * p_inner."priceInCents")) AS median_price,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY op."quantity") AS median_quantity
                FROM "orderProducts" op
                JOIN "orders" o ON op."orderId" = o."id"
                JOIN "products" p_inner ON op."productId" = p_inner."id"
                WHERE o."status" = 'delivered'
                  AND o."createdAt" >= prev_start_date
                  AND o."createdAt" <= prev_end_date
                GROUP BY op."productId"
            ) prev_data ON p."id" = prev_data."productId"
            WHERE "comparison" = TRUE OR prev_data."productId" IS NOT NULL
        ),
        'startDate', to_char("startDate", 'YYYY-MM-DD'),
        'endDate', to_char("endDate", 'YYYY-MM-DD')
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;