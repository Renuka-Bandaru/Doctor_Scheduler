/**
 * useAppointments Hook
 *
 * This is a custom hook that encapsulates the business logic for fetching
 * and managing appointments. This is the "headless" pattern - separating
 * logic from presentation.
 *
 * TODO for candidates:
 * 1. Implement the hook to fetch appointments based on filters
 * 2. Add loading and error states
 * 3. Consider memoization for performance
 * 4. Think about how to make this reusable for both day and week views
 */

import { useState, useEffect, useMemo } from 'react';
import type { Appointment, Doctor } from '@/types';
import { appointmentService } from '@/services/appointmentService';

/**
 * Hook parameters
 */
interface UseAppointmentsParams {
  doctorId: string;
  date: Date;
  // For week view, you might want to pass a date range instead
  startDate?: Date;
  endDate?: Date;
}

/**
 * Hook return value
 */
interface UseAppointmentsReturn {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  loading: boolean;
  error: Error | null;
  // Add any other useful data or functions
}

/**
 * useAppointments Hook
 *
 * Fetches and manages appointment data for a given doctor and date/date range.
 *
 * TODO: Implement this hook
 *
 * Tips:
 * - Use useState for loading and error states
 * - Use useEffect to fetch data when params change
 * - Use useMemo to memoize expensive computations
 * - Consider how to handle both single date (day view) and date range (week view)
 */
export function useAppointments(params: UseAppointmentsParams): UseAppointmentsReturn {
  const { doctorId, date, startDate, endDate } = params;

  // TODO: Add state for appointments, loading, error
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // TODO: Fetch doctor data
  const doctor = useMemo(() => {
    if (!doctorId) return undefined;
    return appointmentService.getDoctorById(doctorId);
  }, [doctorId]);

  // TODO: Fetch appointments when dependencies change
  useEffect(() => {
    if (!doctorId) {
      setAppointments([]);
      setLoading(false);
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      let data: Appointment[] = [];
  
      if (startDate && endDate) {
        // Week view
        data = appointmentService.getAppointmentsByDoctorAndDateRange(
          doctorId,
          startDate,
          endDate
        );
      } else {
        // Day view
        data = appointmentService.getAppointmentsByDoctorAndDate(doctorId, date);
      }
  
      // Optional: sort appointments by time
      data = appointmentService.sortAppointmentsByTime(data);
  
      setAppointments(data);
    } catch (err) {
      setError(err as Error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [doctorId, date, startDate, endDate]);
  
  return {
    appointments,
    doctor,
    loading,
    error,
  };
}

/**
 * BONUS: Create additional hooks for specific use cases
 *
 * Examples:
 * - useDayViewAppointments(doctorId: string, date: Date)
 * - useWeekViewAppointments(doctorId: string, weekStartDate: Date)
 * - useDoctors() - hook to get all doctors
 */
