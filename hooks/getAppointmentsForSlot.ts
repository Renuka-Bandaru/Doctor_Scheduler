import type { Appointment } from '../types';

export function getAppointmentsForSlot(slot: { start: Date; end: Date }, appointments: Appointment[]): Appointment[] {
  return appointments.filter((apt) => {
    const aptStart = new Date(apt.startTime);
    const aptEnd = new Date(apt.endTime);
    return aptStart < slot.end && aptEnd > slot.start;
  });
}
