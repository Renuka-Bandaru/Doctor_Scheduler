/**
 * ScheduleView Component
 *
 * Main component that orchestrates the schedule display.
 * This component should compose smaller components together.
 *
 * TODO for candidates:
 * 1. Create the component structure (header, controls, calendar)
 * 2. Compose DoctorSelector, DayView, WeekView together
 * 3. Handle view switching (day vs week)
 * 4. Manage state or use the useAppointments hook
 * 5. Think about component composition and reusability
 */

'use client';

import { useState } from 'react';
import type { CalendarView } from '@/types';
import { DoctorSelector } from './DoctorSelector';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { useAppointments } from '@/hooks/useAppointments';
import { addDays, startOfWeek } from 'date-fns';

// TODO: Import your components
// import { DoctorSelector } from './DoctorSelector';
// import { DayView } from './DayView';
// import { WeekView } from './WeekView';

interface ScheduleViewProps {
  selectedDoctorId: string;
  selectedDate: Date;
  view: CalendarView;
  onDoctorChange: (doctorId: string) => void;
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
}

/**
 * ScheduleView Component
 *
 * This is the main container component for the schedule interface.
 *
 * TODO: Implement this component
 *
 * Consider:
 * - How to structure the layout (header, controls, calendar)
 * - How to compose smaller components
 * - How to pass data down to child components
 * - How to handle user interactions (view switching, date changes)
 */
export function ScheduleView({
  selectedDoctorId,
  selectedDate,
  view,
  onDoctorChange,
  onDateChange,
  onViewChange,
}: ScheduleViewProps) {
  // TODO: Use the useAppointments hook to fetch data
  const { appointments, doctor, loading, error } = useAppointments({
    doctorId: selectedDoctorId,
    date: selectedDate,
    startDate: view === 'week' ? startOfWeek(selectedDate, { weekStartsOn: 1 }) : undefined,
    endDate: view === 'week' ? addDays(startOfWeek(selectedDate, { weekStartsOn: 1 }), 6) : undefined,
  });

  return (
    <div className="bg-white rounded-xl shadow ring-1 ring-black/5">
      {/* TODO: Implement the component structure */}

      {/* Header with doctor info and controls */}
      <div className="border-b border-gray-200 p-6 bg-gray-50/60 rounded-t-xl">
        <div className="flex justify-between items-center gap-6 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Doctor Schedule</h2>
            <p className="text-sm text-gray-600 mt-1">
              {doctor ? `Dr. ${doctor.name} - ${doctor.specialty}` : 'Select a doctor'}
            </p>
          </div>

          <div className="flex flex-wrap gap-6 items-center justify-between p-4 bg-white rounded-xl shadow-md">
            {/* Doctor Selector */}
            <div className="min-w-[16rem]">
              <DoctorSelector
                selectedDoctorId={selectedDoctorId}
                onDoctorChange={onDoctorChange}
              />
            </div>

            {/* Date Picker */}
            <div className="min-w-[12rem]">
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
                value={new Date(selectedDate).toISOString().slice(0, 10)}
                onChange={(e) => onDateChange(new Date(e.target.value))}
              />
            </div>

            {/* View Toggle Buttons */}
            <div className="flex gap-3 min-w-[10rem]">
              <button
                className={`px-4 py-2 text-sm rounded-md shadow-sm border transition-all duration-150 ${view === 'day'
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                onClick={() => onViewChange('day')}
              >
                Day
              </button>
              <button
                className={`px-4 py-2 text-sm rounded-md shadow-sm border transition-all duration-150 ${view === 'week'
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                onClick={() => onViewChange('week')}
              >
                Week
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Calendar View */}
      <div className="p-6">
        {loading && (
          <div className="text-center text-gray-500 py-12">Loading appointments…</div>
        )}
        {error && (
          <div className="text-center text-red-600 py-12">{error.message}</div>
        )}
        {!loading && !error && (
          <>
            {view === 'day' ? (
              <DayView appointments={appointments} doctor={doctor} date={selectedDate} />
            ) : (
              <WeekView
                appointments={appointments}
                doctor={doctor}
                weekStartDate={startOfWeek(selectedDate, { weekStartsOn: 1 })}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
