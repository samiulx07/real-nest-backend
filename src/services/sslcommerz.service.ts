import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

export interface SSLCommerzInitPayload {
  bookingId: string;
  tranId?: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  flatTitle: string;
}

export class SSLCommerzService {
  private static getApiUrl(): string {
    const isLive = env.SSLCOMMERZ_IS_LIVE === "true";
    return isLive
      ? "https://securepay.sslcommerz.com"
      : "https://sandbox.sslcommerz.com";
  }

  /**
   * Initiate SSLCommerz Gateway Session
   */
  public static async initiateSession(payload: SSLCommerzInitPayload): Promise<{ gatewayUrl: string; tranId: string }> {
    const tranId = payload.tranId || `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const baseUrl = env.BACKEND_BASE_URL || "http://localhost:5000";

    const postParams = new URLSearchParams({
      store_id: env.SSLCOMMERZ_STORE_ID,
      store_passwd: env.SSLCOMMERZ_STORE_PASSWORD,
      total_amount: payload.amount.toString(),
      currency: "BDT",
      tran_id: tranId,
      success_url: `${baseUrl}/api/v1/payments/ssl-success?bookingId=${payload.bookingId}&tranId=${tranId}`,
      fail_url: `${baseUrl}/api/v1/payments/ssl-fail?bookingId=${payload.bookingId}&tranId=${tranId}`,
      cancel_url: `${baseUrl}/api/v1/payments/ssl-cancel?bookingId=${payload.bookingId}&tranId=${tranId}`,
      ipn_url: `${baseUrl}/api/v1/payments/ssl-ipn`,

      cus_name: payload.customerName || "Customer",
      cus_email: payload.customerEmail || "customer@example.com",
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: payload.customerPhone || "01700000000",

      shipping_method: "NO",
      product_name: payload.flatTitle || "Real Estate Flat Unit Reservation",
      product_category: "Real Estate",
      product_profile: "non-physical-goods",
    });

    try {
      const response = await fetch(`${this.getApiUrl()}/gwprocess/v4/api.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: postParams.toString(),
      });

      const data = await response.json();

      if (data?.status === "SUCCESS" && data?.GatewayPageURL) {
        return {
          gatewayUrl: data.GatewayPageURL,
          tranId,
        };
      }

      throw new ApiError(400, data?.failedreason || "Failed to initialize SSLCommerz gateway session");
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      console.error("SSLCommerz Gateway Error:", err?.message || err);
      throw new ApiError(500, "SSLCommerz payment gateway communication error");
    }
  }

  /**
   * Validate SSLCommerz Transaction
   */
  public static async validateTransaction(valId: string): Promise<any> {
    const storeId = env.SSLCOMMERZ_STORE_ID;
    const storePasswd = env.SSLCOMMERZ_STORE_PASSWORD;
    const url = `${this.getApiUrl()}/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${storeId}&store_passwd=${storePasswd}&v=1&format=json`;

    try {
      const response = await fetch(url);
      return await response.json();
    } catch (err: any) {
      console.error("SSLCommerz Validation Error:", err?.message || err);
      throw new ApiError(500, "Failed to validate transaction with SSLCommerz server");
    }
  }
}
