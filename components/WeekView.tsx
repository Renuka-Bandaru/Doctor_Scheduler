/**
 * WeekView Component
 *
 * Displays appointments for a week (Monday - Sunday) in a grid format.
 *
 * TODO for candidates:
 * 1. Generate a 7-day grid (Monday through Sunday)
 * 2. Generate time slots for each day
 * 3. Position appointments in the correct day and time
 * 4. Make it responsive (may need horizontal scroll on mobile)
 * 5. Color-code appointments by type
 * 6. Handle overlapping appointments
 */

'use client';

import type { Appointment, Doctor, TimeSlot } from '@/types';
import { addDays, format, isSameDay, startOfWeek } from 'date-fns';
import { generateTimeSlots as generateSlots } from '@/app/domain/TimeSlot';
import AppointmentCard from './ui/AppointmentCard';
import { getPatientById } from '@/data/mockData';

interface WeekViewProps {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  weekStartDate: Date; // Should be a Monday
}

export function WeekView({ appointments, doctor, weekStartDate }: WeekViewProps) {
  function getWeekDays(): Date[] {
    const start = startOfWeek(weekStartDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }

  function generateTimeSlots(): TimeSlot[] {
    return generateSlots(weekStartDate);
  }

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

  const weekDays = getWeekDays();
  const timeSlots = generateTimeSlots();

  const rows: Array<{
    id: string;
    dayLabel: string;
    timeLabel: string;
    patientId: string;
    patient: string;
    type: string;
    duration: number;
    status: string;
  }> = [];

  weekDays.forEach((day) => {
    const dayApts = appointments
      .filter((apt) => isSameDay(new Date(apt.startTime), day))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    dayApts.forEach((apt) => {
      rows.push({
        id: apt.id,
        dayLabel: `${format(day, 'EEE')} ${format(day, 'MMM d')}`,
        timeLabel: `${new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(apt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        patientId: apt.patientId,
        patient: getPatientById(apt.patientId)?.name ?? 'Unknown Patient',
        type: apt.type,
        duration: minutesBetween(apt.startTime, apt.endTime),
        status: apt.status,
      });
    });
  });

  return (
    <div className="week-view">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
          Week View
        </h3>
        {doctor && (
          <p className="text-sm text-gray-600">
            Dr. {doctor.name} - {doctor.specialty}
          </p>
        )}
      </div>

      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
              <col className="w-1/6" />
            </colgroup>
            <thead className="bg-gray-100">
              <tr className="text-left text-xs font-semibold text-gray-700">
                <th className="px-4 py-3 border border-gray-300">Day</th>
                <th className="px-4 py-3 border border-gray-300">Time</th>
                <th className="px-4 py-3 border border-gray-300">Patient</th>
                <th className="px-4 py-3 border border-gray-300">Type</th>
                <th className="px-4 py-3 border border-gray-300">Duration</th>
                <th className="px-4 py-3 border border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500 border border-gray-300">No appointments scheduled for this week</td>
                </tr>
              )}
              {rows.map((r, i) => (
                <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap border border-gray-300">{r.dayLabel}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap border border-gray-300">{r.timeLabel}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${patientBadgeClass(r.patientId)}`}>
                      {r.patient}
                    </span>
                  </td>
                  <td className="px-4 py-3 border border-gray-300">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset capitalize ${typeBadgeClass[r.type]}`}>
                      {r.type.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border border-gray-300">{r.duration} min</td>
                  <td className="px-4 py-3 border border-gray-300">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset capitalize ${statusBadgeClass[r.status]}`}>
                      {r.status.replace('-', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * List table view version for the week
 */
