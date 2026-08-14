// ─── Installment Schedule Calculator Utility ────────────────────────
// Generates a month-by-month installment schedule from flat price,
// total months, and initial booking amount.

export interface InstallmentItem {
  month: number;
  description: string;
  amount: number;
  dueDate: string; // ISO date string e.g. "2026-09-15T00:00:00.000Z"
  dueDateFormatted: string; // e.g. "Sep 15, 2026"
  status: "PAID" | "NEXT_DUE" | "UPCOMING";
}

export interface InstallmentSchedule {
  totalPrice: number;
  totalMonths: number;
  initialBookingAmount: number;
  monthlyInstallmentAmount: number;
  startDate: string;
  items: InstallmentItem[];
}

/**
 * Generate a full installment schedule array with automatic month-by-month due dates.
 *
 * @param flatPrice          Total flat price (e.g. 5000000)
 * @param totalMonths        Total installment months including booking month (e.g. 5)
 * @param initialBookingAmt  Booking / downpayment amount for month 1 (e.g. 100000)
 * @param paidCount          Number of installments already paid (default 0)
 * @param startDate          Start / booking date from which each month's due date is calculated (defaults to now)
 */
export function generateSchedule(
  flatPrice: number,
  totalMonths: number,
  initialBookingAmt: number,
  paidCount: number = 0,
  startDate: Date | string = new Date()
): InstallmentSchedule {
  const baseDate = new Date(startDate);
  const remainingAmount = flatPrice - initialBookingAmt;
  const remainingMonths = totalMonths - 1;
  const monthlyAmount =
    remainingMonths > 0
      ? Math.round((remainingAmount / remainingMonths) * 100) / 100
      : 0;

  const items: InstallmentItem[] = [];

  for (let i = 1; i <= totalMonths; i++) {
    const amount = i === 1 ? initialBookingAmt : monthlyAmount;
    const description =
      i === 1
        ? "Booking Downpayment"
        : `Installment ${i} of ${totalMonths}`;

    // Automatically calculate due date: Month i is (i - 1) months after startDate
    const itemDate = new Date(baseDate);
    itemDate.setMonth(itemDate.getMonth() + (i - 1));

    const dueDate = itemDate.toISOString();
    const dueDateFormatted = itemDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    let status: InstallmentItem["status"];
    if (i <= paidCount) {
      status = "PAID";
    } else if (i === paidCount + 1) {
      status = "NEXT_DUE";
    } else {
      status = "UPCOMING";
    }

    items.push({
      month: i,
      description,
      amount,
      dueDate,
      dueDateFormatted,
      status,
    });
  }

  // Adjust last month for any rounding difference
  if (totalMonths > 1 && items.length > 0) {
    const sumSoFar = items.reduce((acc, item) => acc + item.amount, 0);
    const diff = flatPrice - sumSoFar;
    if (Math.abs(diff) > 0.01) {
      items[items.length - 1].amount += diff;
      items[items.length - 1].amount =
        Math.round(items[items.length - 1].amount * 100) / 100;
    }
  }

  return {
    totalPrice: flatPrice,
    totalMonths,
    initialBookingAmount: initialBookingAmt,
    monthlyInstallmentAmount: monthlyAmount,
    startDate: baseDate.toISOString(),
    items,
  };
}

/**
 * Compute total amount for the first N selected installments.
 *
 * @param schedule  The full installment schedule
 * @param count     Number of installments selected (sequential from month 1)
 */
export function computeSelectedTotal(
  schedule: InstallmentSchedule,
  count: number
): { totalSelected: number; remaining: number } {
  const selected = schedule.items.slice(0, count);
  const totalSelected = selected.reduce((acc, item) => acc + item.amount, 0);
  return {
    totalSelected: Math.round(totalSelected * 100) / 100,
    remaining: Math.round((schedule.totalPrice - totalSelected) * 100) / 100,
  };
}

/**
 * Get effective installment parameters for a flat, resolving
 * whether to use the flat's custom values or the property's global defaults.
 */
export function getEffectiveInstallmentParams(
  property: {
    allowInstallment: boolean;
    totalInstallmentMonths: number;
    initialBookingAmount: number;
  },
  flat: {
    useCustomInstallment: boolean;
    totalInstallmentMonths: number | null;
    initialBookingAmount: number | null;
  }
): {
  allowInstallment: boolean;
  totalInstallmentMonths: number;
  initialBookingAmount: number;
} {
  return {
    allowInstallment: property.allowInstallment,
    totalInstallmentMonths: flat.useCustomInstallment && flat.totalInstallmentMonths
      ? flat.totalInstallmentMonths
      : property.totalInstallmentMonths,
    initialBookingAmount: flat.useCustomInstallment && flat.initialBookingAmount
      ? flat.initialBookingAmount
      : property.initialBookingAmount,
  };
}
