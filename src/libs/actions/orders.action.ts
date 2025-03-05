import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "../supabase/supabase-server";
import { cookies } from "next/headers";


const supabase = () => {
  const cookieStore = cookies();
  return createSupabaseServerClient(cookieStore);
};


interface OrderStats {
  date: string;
  day?: string;
  dayOfTheWeek?: string;
  week?: string;
  month?: string;
  year: string;
  orderCount: number;
  totalIncomeInCents: number;
  totalProductsSold: number;
  medianIncomeInCents: number;
  medianProductsSold: number;
}


interface GetOrderStatsResponse {
  function: string;
  data: OrderStats[];
  comparisonData: OrderStats[];
  sequence: "day" | "week" | "month";
  startDate: string;
  endDate: string;
}


interface GetOrderStatsParams {
  startDate: string;
  endDate: string;
  comparison: boolean;
}


export const getOrderStatsByDay = async ({
  startDate,
  endDate,
  comparison,
}: GetOrderStatsParams): Promise<GetOrderStatsResponse> => {
  noStore();

  try {
    const { data, error } = await supabase().rpc("getOrderStatsByDay", {
      startDate,
      endDate,
      comparison,
    });

    if (error) {
      console.error("Error calling getOrderStatsByDay RPC:", error);
      throw new Error(`Failed to fetch order stats by day: ${error.message}`);
    }

    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from getOrderStatsByDay RPC");
    }

    return data as GetOrderStatsResponse;
  } catch (err) {
    console.error("Unexpected error in getOrderStatsByDay:", err);
    throw err;
  }
};


export const getOrderStatsByWeek = async ({
  startDate,
  endDate,
  comparison,
}: GetOrderStatsParams): Promise<GetOrderStatsResponse> => {
  noStore();

  try {
    const { data, error } = await supabase().rpc("getOrderStatsByWeek", {
      startDate,
      endDate,
      comparison,
    });

    if (error) {
      console.error("Error calling getOrderStatsByWeek RPC:", error);
      throw new Error(`Failed to fetch order stats by week: ${error.message}`);
    }

    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from getOrderStatsByWeek RPC");
    }

    return data as GetOrderStatsResponse;
  } catch (err) {
    console.error("Unexpected error in getOrderStatsByWeek:", err);
    throw err;
  }
};


export const getOrderStatsByMonth = async ({
  startDate,
  endDate,
  comparison,
}: GetOrderStatsParams): Promise<GetOrderStatsResponse> => {
  noStore();

  try {
    const { data, error } = await supabase().rpc("getOrderStatsByMonth", {
      startDate,
      endDate,
      comparison,
    });

    if (error) {
      console.error("Error calling getOrderStatsByMonth RPC:", error);
      throw new Error(`Failed to fetch order stats by month: ${error.message}`);
    }

    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from getOrderStatsByMonth RPC");
    }

    return data as GetOrderStatsResponse;
  } catch (err) {
    console.error("Unexpected error in getOrderStatsByMonth:", err);
    throw err;
  }
};