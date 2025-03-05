CREATE OR REPLACE FUNCTION "getOrderStatsByMonth"(
    "startDate" TIMESTAMP WITH TIME ZONE,
    "endDate" TIMESTAMP WITH TIME ZONE,
    "comparison" BOOLEAN
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    prev_start_date TIMESTAMP WITH TIME ZONE := "startDate" - INTERVAL '1 year';
    prev_end_date TIMESTAMP WITH TIME ZONE := "endDate" - INTERVAL '1 year';
BEGIN
    result := json_build_object(
        'function', 'getOrderStatsByMonth',
        'data', (
            SELECT COALESCE(json_agg(json_build_object(
                'date', to_char(periods.period_start, 'YYYY-MM-DD'),
                'month', TRIM(to_char(periods.period_start, 'Month')),
                'year', to_char(periods.period_start, 'YYYY'),
                'orderCount', COALESCE(curr_data.order_count, 0),
                'totalIncomeInCents', COALESCE(curr_data.total_income, 0),
                'totalProductsSold', COALESCE(curr_data.total_products_sold, 0),
                'medianIncomeInCents', COALESCE(curr_data.median_income, 0),
                'medianProductsSold', COALESCE(curr_data.median_products_sold, 0)
            ) ORDER BY periods.period_start), '[]'::json)
            FROM generate_series(
                date_trunc('month', "startDate"),
                date_trunc('month', "endDate"),
                INTERVAL '1 month'
            ) AS periods(period_start)
            LEFT JOIN (
                SELECT
                    date_trunc('month', o."createdAt") AS period_start,
                    COUNT(DISTINCT o."id") AS order_count,
                    SUM(o."totalPriceInCents") AS total_income,
                    SUM(op.quantity) AS total_products_sold,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY o."totalPriceInCents") AS median_income,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (SELECT SUM(op_inner.quantity) FROM "orderProducts" op_inner WHERE op_inner."orderId" = o."id")) AS median_products_sold
                FROM "orders" o
                LEFT JOIN "orderProducts" op ON op."orderId" = o."id"
                WHERE o."status" = 'delivered'
                  AND o."createdAt" >= "startDate"
                  AND o."createdAt" <= "endDate"
                GROUP BY date_trunc('month', o."createdAt")
            ) curr_data ON periods.period_start = curr_data.period_start
        ),
        'comparisonData', (
            SELECT COALESCE(json_agg(json_build_object(
                'date', to_char(periods.period_start, 'YYYY-MM-DD'),
                'month', TRIM(to_char(periods.period_start, 'Month')),
                'year', to_char(periods.period_start, 'YYYY'),
                'orderCount', COALESCE(prev_data.order_count, 0),
                'totalIncomeInCents', COALESCE(prev_data.total_income, 0),
                'totalProductsSold', COALESCE(prev_data.total_products_sold, 0),
                'medianIncomeInCents', COALESCE(prev_data.median_income, 0),
                'medianProductsSold', COALESCE(prev_data.median_products_sold, 0)
            ) ORDER BY periods.period_start) FILTER (WHERE "comparison" = TRUE), '[]'::json)
            FROM generate_series(
                date_trunc('month', prev_start_date),
                date_trunc('month', prev_end_date),
                INTERVAL '1 month'
            ) AS periods(period_start)
            LEFT JOIN (
                SELECT
                    date_trunc('month', o."createdAt") AS period_start,
                    COUNT(DISTINCT o."id") AS order_count,
                    SUM(o."totalPriceInCents") AS total_income,
                    SUM(op.quantity) AS total_products_sold,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY o."totalPriceInCents") AS median_income,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (SELECT SUM(op_inner.quantity) FROM "orderProducts" op_inner WHERE op_inner."orderId" = o."id")) AS median_products_sold
                FROM "orders" o
                LEFT JOIN "orderProducts" op ON op."orderId" = o."id"
                WHERE o."status" = 'delivered'
                  AND o."createdAt" >= prev_start_date
                  AND o."createdAt" <= prev_end_date
                GROUP BY date_trunc('month', o."createdAt")
            ) prev_data ON periods.period_start = prev_data.period_start
        ),
        'sequence', 'month',
        'startDate', to_char("startDate", 'YYYY-MM-DD'),
        'endDate', to_char("endDate", 'YYYY-MM-DD')
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION "getOrderStatsByWeek"(
    "startDate" TIMESTAMP WITH TIME ZONE,
    "endDate" TIMESTAMP WITH TIME ZONE,
    "comparison" BOOLEAN
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    prev_start_date TIMESTAMP WITH TIME ZONE := "startDate" - INTERVAL '1 year';
    prev_end_date TIMESTAMP WITH TIME ZONE := "endDate" - INTERVAL '1 year';
BEGIN
    result := json_build_object(
        'function', 'getOrderStatsByWeek',
        'data', (
            SELECT COALESCE(json_agg(json_build_object(
                'date', to_char(periods.period_start, 'YYYY-MM-DD'),
                'day', TRIM(to_char(periods.period_start, 'DD Month')),
                'week', 'Week ' || EXTRACT(WEEK FROM periods.period_start)::TEXT,
                'year', to_char(periods.period_start, 'YYYY'),
                'orderCount', COALESCE(curr_data.order_count, 0),
                'totalIncomeInCents', COALESCE(curr_data.total_income, 0),
                'totalProductsSold', COALESCE(curr_data.total_products_sold, 0),
                'medianIncomeInCents', COALESCE(curr_data.median_income, 0),
                'medianProductsSold', COALESCE(curr_data.median_products_sold, 0)
            ) ORDER BY periods.period_start), '[]'::json)
            FROM generate_series(
                date_trunc('week', "startDate"),
                date_trunc('week', "endDate"),
                INTERVAL '1 week'
            ) AS periods(period_start)
            LEFT JOIN (
                SELECT
                    date_trunc('week', o."createdAt") AS period_start,
                    COUNT(DISTINCT o."id") AS order_count,
                    SUM(o."totalPriceInCents") AS total_income,
                    SUM(op.quantity) AS total_products_sold,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY o."totalPriceInCents") AS median_income,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (SELECT SUM(op_inner.quantity) FROM "orderProducts" op_inner WHERE op_inner."orderId" = o."id")) AS median_products_sold
                FROM "orders" o
                LEFT JOIN "orderProducts" op ON op."orderId" = o."id"
                WHERE o."status" = 'delivered'
                  AND o."createdAt" >= "startDate"
                  AND o."createdAt" <= "endDate"
                GROUP BY date_trunc('week', o."createdAt")
            ) curr_data ON periods.period_start = curr_data.period_start
        ),
        'comparisonData', (
            SELECT COALESCE(json_agg(json_build_object(
                'date', to_char(periods.period_start, 'YYYY-MM-DD'),
                'day', TRIM(to_char(periods.period_start, 'DD Month')),
                'week', 'Week ' || EXTRACT(WEEK FROM periods.period_start)::TEXT,
                'year', to_char(periods.period_start, 'YYYY'),
                'orderCount', COALESCE(prev_data.order_count, 0),
                'totalIncomeInCents', COALESCE(prev_data.total_income, 0),
                'totalProductsSold', COALESCE(prev_data.total_products_sold, 0),
                'medianIncomeInCents', COALESCE(prev_data.median_income, 0),
                'medianProductsSold', COALESCE(prev_data.median_products_sold, 0)
            ) ORDER BY periods.period_start) FILTER (WHERE "comparison" = TRUE), '[]'::json)
            FROM generate_series(
                date_trunc('week', prev_start_date),
                date_trunc('week', prev_end_date),
                INTERVAL '1 week'
            ) AS periods(period_start)
            LEFT JOIN (
                SELECT
                    date_trunc('week', o."createdAt") AS period_start,
                    COUNT(DISTINCT o."id") AS order_count,
                    SUM(o."totalPriceInCents") AS total_income,
                    SUM(op.quantity) AS total_products_sold,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY o."totalPriceInCents") AS median_income,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (SELECT SUM(op_inner.quantity) FROM "orderProducts" op_inner WHERE op_inner."orderId" = o."id")) AS median_products_sold
                FROM "orders" o
                LEFT JOIN "orderProducts" op ON op."orderId" = o."id"
                WHERE o."status" = 'delivered'
                  AND o."createdAt" >= prev_start_date
                  AND o."createdAt" <= prev_end_date
                GROUP BY date_trunc('week', o."createdAt")
            ) prev_data ON periods.period_start = prev_data.period_start
        ),
        'sequence', 'week',
        'startDate', to_char("startDate", 'YYYY-MM-DD'),
        'endDate', to_char("endDate", 'YYYY-MM-DD')
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION "getOrderStatsByDay"(
    "startDate" TIMESTAMP WITH TIME ZONE,
    "endDate" TIMESTAMP WITH TIME ZONE,
    "comparison" BOOLEAN
)
RETURNS JSON AS $$
DECLARE
    result JSON;
    prev_start_date TIMESTAMP WITH TIME ZONE := "startDate" - INTERVAL '1 year';
    prev_end_date TIMESTAMP WITH TIME ZONE := "endDate" - INTERVAL '1 year';
BEGIN
    result := json_build_object(
        'function', 'getOrderStatsByDay',
        'data', (
            SELECT COALESCE(json_agg(json_build_object(
                'date', to_char(periods.period_start, 'YYYY-MM-DD'),
                'day', TRIM(to_char(periods.period_start, 'DD Month')),
                'dayOfTheWeek', TRIM(to_char(periods.period_start, 'Day')),
                'year', to_char(periods.period_start, 'YYYY'),
                'orderCount', COALESCE(curr_data.order_count, 0),
                'totalIncomeInCents', COALESCE(curr_data.total_income, 0),
                'totalProductsSold', COALESCE(curr_data.total_products_sold, 0),
                'medianIncomeInCents', COALESCE(curr_data.median_income, 0),
                'medianProductsSold', COALESCE(curr_data.median_products_sold, 0)
            ) ORDER BY periods.period_start), '[]'::json)
            FROM generate_series(
                date_trunc('day', "startDate"),
                date_trunc('day', "endDate"),
                INTERVAL '1 day'
            ) AS periods(period_start)
            LEFT JOIN (
                SELECT
                    date_trunc('day', o."createdAt") AS period_start,
                    COUNT(DISTINCT o."id") AS order_count,
                    SUM(o."totalPriceInCents") AS total_income,
                    SUM(op.quantity) AS total_products_sold,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY o."totalPriceInCents") AS median_income,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (SELECT SUM(op_inner.quantity) FROM "orderProducts" op_inner WHERE op_inner."orderId" = o."id")) AS median_products_sold
                FROM "orders" o
                LEFT JOIN "orderProducts" op ON op."orderId" = o."id"
                WHERE o."status" = 'delivered'
                  AND o."createdAt" >= "startDate"
                  AND o."createdAt" <= "endDate"
                GROUP BY date_trunc('day', o."createdAt")
            ) curr_data ON periods.period_start = curr_data.period_start
        ),
        'comparisonData', (
            SELECT COALESCE(json_agg(json_build_object(
                'date', to_char(periods.period_start, 'YYYY-MM-DD'),
                'day', TRIM(to_char(periods.period_start, 'DD Month')),
                'dayOfTheWeek', TRIM(to_char(periods.period_start, 'Day')),
                'year', to_char(periods.period_start, 'YYYY'),
                'orderCount', COALESCE(prev_data.order_count, 0),
                'totalIncomeInCents', COALESCE(prev_data.total_income, 0),
                'totalProductsSold', COALESCE(prev_data.total_products_sold, 0),
                'medianIncomeInCents', COALESCE(prev_data.median_income, 0),
                'medianProductsSold', COALESCE(prev_data.median_products_sold, 0)
            ) ORDER BY periods.period_start) FILTER (WHERE "comparison" = TRUE), '[]'::json)
            FROM generate_series(
                date_trunc('day', prev_start_date),
                date_trunc('day', prev_end_date),
                INTERVAL '1 day'
            ) AS periods(period_start)
            LEFT JOIN (
                SELECT
                    date_trunc('day', o."createdAt") AS period_start,
                    COUNT(DISTINCT o."id") AS order_count,
                    SUM(o."totalPriceInCents") AS total_income,
                    SUM(op.quantity) AS total_products_sold,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY o."totalPriceInCents") AS median_income,
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (SELECT SUM(op_inner.quantity) FROM "orderProducts" op_inner WHERE op_inner."orderId" = o."id")) AS median_products_sold
                FROM "orders" o
                LEFT JOIN "orderProducts" op ON op."orderId" = o."id"
                WHERE o."status" = 'delivered'
                  AND o."createdAt" >= prev_start_date
                  AND o."createdAt" <= prev_end_date
                GROUP BY date_trunc('day', o."createdAt")
            ) prev_data ON periods.period_start = prev_data.period_start
        ),
        'sequence', 'day',
        'startDate', to_char("startDate", 'YYYY-MM-DD'),
        'endDate', to_char("endDate", 'YYYY-MM-DD')
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql;