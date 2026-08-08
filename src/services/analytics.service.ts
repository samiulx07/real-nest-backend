import prisma from "../config/prisma";

export const getDashboardSummary = async () => {
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
    totalProperties,
    totalFlats,
    totalBookings,
    pendingPaymentsCount,
    recentPayments,
    recentFlats,
  };
};
