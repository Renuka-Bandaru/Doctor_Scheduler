import type { Appointment, AppointmentType } from '../../types';

interface Props {
  appointment: Appointment;
  patientName: string;
}

export default function AppointmentCard({ appointment, patientName }: Props) {
  const colorMap: Record<AppointmentType, string> = {
    'checkup': 'appointment-checkup',
    'consultation': 'appointment-consultation',
    'follow-up': 'appointment-follow-up',
    'procedure': 'appointment-procedure',
  };

  return (
    <div className={`absolute left-0 right-0 p-2 rounded-md shadow-sm border text-white ${colorMap[appointment.type] ?? 'bg-gray-200'}`}>
      <p className="text-xs font-semibold leading-4">{patientName}</p>
      <p className="text-[10px] opacity-90 capitalize">{appointment.type.replace('-', ' ')}</p>
      <p className="text-[10px] opacity-90">
        {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        {' - '}
        {new Date(appointment.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}
