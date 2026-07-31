import type { Booking } from "../content/types";

export const MAX_PER_WEEK = 4;
export const MAX_PER_DAY = 2;

export function canBookMember(
  memberSlug: string,
  eventDate: string,
  bookings: Booking[],
  maxPerWeek = MAX_PER_WEEK,
  maxPerDay = MAX_PER_DAY,
): boolean {
  const memberBookings = bookings.filter((b) => b.memberSlug === memberSlug);

  const weekCount = getBookingCountForWeek(memberBookings, eventDate);
  if (weekCount >= maxPerWeek) return false;

  const dayCount = getBookingCountForDay(memberBookings, eventDate);
  if (dayCount >= maxPerDay) return false;

  return true;
}

export function addBooking(
  memberSlug: string,
  eventId: string,
  bookings: Booking[],
): Booking[] {
  const booking: Booking = {
    id: `book-${Date.now()}`,
    memberSlug,
    eventId,
    status: "confirmed",
    bookedAt: new Date().toISOString(),
  };
  return [...bookings, booking];
}

export function isAlreadyBooked(
  memberSlug: string,
  eventId: string,
  bookings: Booking[],
): boolean {
  return bookings.some(
    (b) => b.memberSlug === memberSlug && b.eventId === eventId,
  );
}

function getBookingCountForWeek(bookings: Booking[], eventDate: string): number {
  const target = new Date(eventDate);
  const startOfWeek = new Date(target);
  startOfWeek.setDate(target.getDate() - target.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return bookings.filter((b) => {
    const d = new Date(b.bookedAt);
    return d >= startOfWeek && d < endOfWeek;
  }).length;
}

function getBookingCountForDay(bookings: Booking[], eventDate: string): number {
  return bookings.filter((b) => {
    const d = new Date(b.bookedAt);
    const target = new Date(eventDate);
    return d.toDateString() === target.toDateString();
  }).length;
}
