export interface TimeSlot {
    start: Date;
    end: Date;
    label: string;
  }
  
  export function generateTimeSlots(date: Date): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const start = new Date(date);
    start.setHours(8, 0, 0, 0);
  
    const end = new Date(date);
    end.setHours(18, 0, 0, 0);
  
    while (start < end) {
      const slotStart = new Date(start);
      start.setMinutes(start.getMinutes() + 30);
      const slotEnd = new Date(start);
      slots.push({
        start: slotStart,
        end: slotEnd,
        label: slotStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  
    return slots;
  }
  