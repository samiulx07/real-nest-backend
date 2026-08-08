import { Request, Response } from "express";
import * as analyticsService from "../services/analytics.service";

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id || "";
    const role = (req.user as any)?.role || "CUSTOMER";

    const summary = await analyticsService.getDashboardSummary(userId, role);
    res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully",
      data: summary,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard summary",
    });
  }
};
