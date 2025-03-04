import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseServerClient } from "../supabase/supabase-server";
import { cookies } from "next/headers";

const supabase = () => {
  const cookieStore = cookies();
  return createSupabaseServerClient(cookieStore);
};

interface ProductSalesMetrics {
  name: string;
  totalProductsSold: number;
  totalOrderCount: number;
  totalPriceInCents: number;
  medianPriceInCents: number;
  medianNumberOfProductsPerOrder: number;
  prevTotalProductsSold: number;
  prevTotalOrderCount: number;
  prevTotalPriceInCents: number;
  prevMedianPriceInCents: number;
  prevMedianNumberOfProductsPerOrder: number;
}

interface ComparisonProductSalesMetrics {
  name: string;
  totalProductsSold: number;
  totalOrderCount: number;
  totalPriceInCents: number;
  medianPriceInCents: number;
  medianNumberOfProductsPerOrder: number;
}

interface GetIndividualProductSalesResponse {
  function: string;
  data: ProductSalesMetrics[];
  comparisonData: ComparisonProductSalesMetrics[];
  startDate: string;
  endDate: string;
}

interface GetIndividualProductSalesParams {
  startDate: string;
  endDate: string;  
  comparison: boolean;
}

// Function to fetch individual product sales
export const getIndividualProductSales = async ({
  startDate,
  endDate,
  comparison,
}: GetIndividualProductSalesParams): Promise<GetIndividualProductSalesResponse> => {
  noStore();

  try {
   
    const { data, error } = await supabase().rpc("getIndividualProductStats", {
      startDate: startDate,
      endDate: endDate,
      comparison: comparison,
    });

    if (error) {
      console.error("Error calling getIndividualProductSales RPC:", error);
      throw new Error(`Failed to fetch product sales data: ${error.message}`);
    }

    // Ensure the response matches the expected type
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from getIndividualProductSales RPC");
    }

    return data as GetIndividualProductSalesResponse;

  } catch (err) {
    console.error("Unexpected error in getIndividualProductSales:", err);
    throw err; // Re-throw to let the caller handle it
  }
};
