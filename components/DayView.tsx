/**
 * DayView Component
 *
 * Displays appointments for a single day in a timeline format.
 *
 * TODO for candidates:
 * 1. Generate time slots (8 AM - 6 PM, 30-minute intervals)
 * 2. Position appointments in their correct time slots
 * 3. Handle appointments that span multiple slots
 * 4. Display appointment details (patient, type, duration)
 * 5. Color-code appointments by type
 * 6. Handle overlapping appointments gracefully
 */

'use client';

import type { Appointment, Doctor, TimeSlot } from '@/types';
import { generateTimeSlots as generateSlots } from '@/app/domain/TimeSlot';
import { getAppointmentsForSlot as getAptsForSlot } from '@/hooks/getAppointmentsForSlot';
import AppointmentCard from './ui/AppointmentCard';
import { getPatientById } from '@/data/mockData';

interface DayViewProps {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  date: Date;
}

/**
 * DayView Component
 *
 * Renders a daily timeline view with appointments.
 *
 * TODO: Implement this component
 *
 * Architecture suggestions:
 * 1. Create a helper function to generate time slots
 * 2. Create a TimeSlotRow component for each time slot
 * 3. Create an AppointmentCard component for each appointment
 * 4. Calculate appointment positioning based on start/end times
 *
 * Consider:
 * - How to handle appointments that span multiple 30-min slots?
 * - How to show overlapping appointments?
 * - How to make the timeline scrollable if needed?
 * - How to highlight the current time?
 */
export function DayView({ appointments, doctor, date }: DayViewProps) {
  /**
   * Generate time slots (8 AM - 6 PM)
   */
  function generateTimeSlots(): TimeSlot[] {
    return generateSlots(date);
  }

  /**
   * Find appointments for a specific time slot
   */
  function getAppointmentsForSlot(slot: TimeSlot): Appointment[] {
    return getAptsForSlot({ start: slot.start, end: slot.end }, appointments);
  }

  const timeSlots = generateTimeSlots();

  // Derived data for table view
  const dayAppointments = [...appointments]
    .filter((apt) => {
      const d = new Date(apt.startTime);
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  function minutesBetween(startIso: string, endIso: string): number {
    const s = new Date(startIso).getTime();
    const e = new Date(endIso).getTime();
    return Math.max(0, Math.round((e - s) / 60000));
  }

  const typeBadgeClass: Record<string, string> = {
    'checkup': 'bg-blue-100 text-blue-800 ring-blue-200',
    'consultation': 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    'follow-up': 'bg-amber-100 text-amber-800 ring-amber-200',
    'procedure': 'bg-violet-100 text-violet-800 ring-violet-200',
  };

  const statusBadgeClass: Record<string, string> = {
    'scheduled': 'bg-slate-100 text-slate-800 ring-slate-200',
    'completed': 'bg-green-100 text-green-800 ring-green-200',
    'cancelled': 'bg-rose-100 text-rose-800 ring-rose-200',
    'no-show': 'bg-orange-100 text-orange-800 ring-orange-200',
  };

  const patientPalette = [
    'bg-cyan-100 text-cyan-800 ring-cyan-200',
    'bg-sky-100 text-sky-800 ring-sky-200',
    'bg-teal-100 text-teal-800 ring-teal-200',
    'bg-pink-100 text-pink-800 ring-pink-200',
    'bg-indigo-100 text-indigo-800 ring-indigo-200',
    'bg-lime-100 text-lime-800 ring-lime-200',
  ];
  function patientBadgeClass(patientId: string): string {
    let hash = 0;
    for (let i = 0; i < patientId.length; i++) hash = (hash + patientId.charCodeAt(i)) % 2147483647;
    const idx = Math.abs(hash) % patientPalette.length;
    return patientPalette[idx];
  }

  return (
    <div className="day-view">
      {/* Day header */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
          {date.toDateString()}
        </h3>
        {doctor && (
          <p className="text-sm text-gray-600">
            Dr. {doctor.name} - {doctor.specialty}
          </p>
        )}
      </div>

      {/* Table view of appointments */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-1/5" />
              <col className="w-1/5" />
              <col className="w-1/5" />
              <col className="w-1/5" />
              <col className="w-1/5" />
            </colgroup>
            <thead className="bg-gray-100">
              <tr className="text-left text-xs font-semibold text-gray-700">
                <th className="px-4 py-3 border border-gray-300">Time</th>
                <th className="px-4 py-3 border border-gray-300">Patient</th>
                <th className="px-4 py-3 border border-gray-300">Type</th>
                <th className="px-4 py-3 border border-gray-300">Duration</th>
                <th className="px-4 py-3 border border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {dayAppointments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500 border border-gray-300">
                    No appointments scheduled for this day
                  </td>
                </tr>
              )}
              {dayAppointments.map((apt, i) => {
                const patient = getPatientById(apt.patientId);
                const patientName = patient?.name ?? 'Unknown Patient';
                const start = new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const end = new Date(apt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const duration = minutesBetween(apt.startTime, apt.endTime);
                return (
                  <tr key={apt.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap border border-gray-300">{start} - {end}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${patientBadgeClass(apt.patientId)}`}>
                        {patientName}
                      </span>
                    </td>
                    <td className="px-4 py-3 border border-gray-300">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset capitalize ${typeBadgeClass[apt.type]}`}>
                        {apt.type.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-300">{duration} min</td>
                    <td className="px-4 py-3 border border-gray-300">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset capitalize ${statusBadgeClass[apt.status]}`}>
                        {apt.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* The original timeline grid kept commented for reference */}
      {/*
      <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100 bg-white mt-6">
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex">
            <div className="w-24 p-2 text-xs text-gray-500 bg-gray-50">
              {slot.label}
            </div>
            <div className="flex-1 p-2 min-h-[60px] relative">
              {getAppointmentsForSlot(slot).map((appointment) => {
                const patientName = getPatientById(appointment.patientId)?.name ?? 'Unknown Patient';
                return (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    patientName={patientName}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      */}
    </div>
  );
}

/**
 * AppointmentCard is reused from components/ui
 */
