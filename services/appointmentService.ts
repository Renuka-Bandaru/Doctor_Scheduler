import type { Appointment, Doctor, PopulatedAppointment } from '@/types';
import {
  MOCK_APPOINTMENTS,
  MOCK_DOCTORS,
  getDoctorById,
  getPatientById,
} from '@/data/mockData';

export class AppointmentService {
  /**
   * Get all appointments for a specific doctor
   */
  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return MOCK_APPOINTMENTS.filter((appt) => appt.doctorId === doctorId);
  }

  /**
   * Get appointments for a specific doctor on a specific date
   */
  getAppointmentsByDoctorAndDate(doctorId: string, date: Date): Appointment[] {
    return MOCK_APPOINTMENTS.filter((appt) => {
      if (appt.doctorId !== doctorId) return false;
      const apptDate = new Date(appt.startTime);
      return (
        apptDate.getFullYear() === date.getFullYear() &&
        apptDate.getMonth() === date.getMonth() &&
        apptDate.getDate() === date.getDate()
      );
    });
  }

  /**
   * Get appointments for a specific doctor within a date range
   */
  getAppointmentsByDoctorAndDateRange(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ): Appointment[] {
    return MOCK_APPOINTMENTS.filter((appt) => {
      if (appt.doctorId !== doctorId) return false;
      const apptDate = new Date(appt.startTime);
      return apptDate >= startDate && apptDate <= endDate;
    });
  }

  /**
   * Get a populated appointment (includes doctor + patient details)
   */
  getPopulatedAppointment(appointment: Appointment): PopulatedAppointment | null {
    const doctor = getDoctorById(appointment.doctorId);
    const patient = getPatientById(appointment.patientId);

    if (!doctor || !patient) return null;

    return {
      ...appointment,
      doctor,
      patient,
    };
  }

  /**
   * Get all doctors
   */
  getAllDoctors(): Doctor[] {
    return MOCK_DOCTORS;
  }

  /**
   * Get doctor by ID
   */
  getDoctorById(id: string): Doctor | undefined {
    return MOCK_DOCTORS.find((doc) => doc.id === id);
  }

  /**
   * BONUS: Sort appointments by time (useful for day view)
   */
  sortAppointmentsByTime(appointments: Appointment[]): Appointment[] {
    return [...appointments].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }

  /**
   * BONUS: Check if appointments overlap
   */
  hasOverlappingAppointments(appointments: Appointment[]): boolean {
    const sorted = this.sortAppointmentsByTime(appointments);
    for (let i = 1; i < sorted.length; i++) {
      const prevEnd = new Date(sorted[i - 1].endTime);
      const currentStart = new Date(sorted[i].startTime);
      if (currentStart < prevEnd) return true;
    }
    return false;
  }
}

export const appointmentService = new AppointmentService();
