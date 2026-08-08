import prisma from "../config/prisma";

export const getDashboardSummary = async (userId: string, role: string) => {
  if (role === "CUSTOMER") {
    const [
      myBookingsCount,
      pendingPaymentsCount,
      myRecentBookings,
      myPayments,
    ] = await Promise.all([
      prisma.booking.count({ where: { userId } }),
      prisma.payment.count({ where: { userId, status: "PENDING_APPROVAL" } }),
      prisma.booking.findMany({
        where: { userId },
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          flat: {
            include: { property: { select: { title: true, city: true } } },
          },
          payments: { select: { id: true, paymentMethod: true, status: true, receiptUrl: true } },
        },
      }),
      prisma.payment.findMany({
        where: { userId, status: "VALIDATED" },
        select: { amount: true },
      }),
    ]);

    const totalPaidAmount = myPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      isCustomer: true,
      myBookingsCount,
      pendingPaymentsCount,
      totalPaidAmount,
      myRecentBookings,
    };
  }

  // Admin Summary
  const [
    totalProperties,
    totalFlats,
    totalBookings,
    pendingPaymentsCount,
    recentPayments,
    recentFlats,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.flat.count(),
    prisma.booking.count(),
    prisma.payment.count({ where: { status: "PENDING_APPROVAL" } }),
    prisma.payment.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
        booking: {
          include: {
            flat: { select: { title: true, flatNumber: true } },
          },
        },
      },
    }),
    prisma.flat.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        property: { select: { title: true, city: true } },
      },
    }),
  ]);

  return {
    isCustomer: false,
    totalProperties,
    totalFlats,
    totalBookings,
    pendingPaymentsCount,
    recentPayments,
    recentFlats,
  };
};
