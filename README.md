# Hospital Appointment Scheduler - Frontend Challenge

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000


## 🏗️ Implementation Summary

### Architecture Decisions

**Service Layer Pattern**
- Implemented `AppointmentService` as a singleton class to centralize data access
- All data operations go through the service layer, making it easy to swap mock data for real API calls
- Service methods are pure functions that can be easily tested

**Headless Hooks Pattern**
- `useAppointments` hook encapsulates all business logic for fetching and managing appointments
- Separates data fetching from UI components, making components more reusable
- Hook handles loading states, error states, and data transformation

**Component Composition**
- `ScheduleView` acts as the main orchestrator, composing smaller components
- `DayView` and `WeekView` are focused on their specific display concerns
- `AppointmentCard` is a reusable UI component used across views

**Table-First Design**
- Chose table layouts over calendar grids for better data density and readability
- Tables provide clear structure for appointment data with consistent spacing
- Easier to scan and compare appointments across time periods

### Component Structure

```
app/schedule/page.tsx (Entry Point)
├── ScheduleView (Main Container)
    ├── DoctorSelector (Doctor Selection)
    ├── DayView (Day Table)
    │   └── AppointmentCard (Reusable)
    └── WeekView (Week Table)
        └── AppointmentCard (Reusable)

hooks/
├── useAppointments (Data Logic)
└── getAppointmentsForSlot (Utility)

services/
└── appointmentService (Data Access)

components/ui/
└── AppointmentCard (Shared UI)
```

**Data Flow:**
1. `ScheduleView` uses `useAppointments` hook
2. Hook calls `appointmentService` methods
3. Service returns filtered/sorted appointment data
4. Views render data in table format with colored badges

### Trade-offs & Future Improvements

**What We Implemented Well:**
- Clean separation of concerns with service layer and hooks
- Consistent styling with Tailwind CSS
- Responsive table layouts with proper spacing
- Color-coded badges for visual distinction
- Type-safe implementation with TypeScript

**What Could Be Improved with More Time:**

1. **Performance Optimizations**
   - Add React.memo to prevent unnecessary re-renders
   - Implement virtual scrolling for large appointment lists
   - Add debouncing to date picker changes

2. **Enhanced UX**
   - Add loading skeletons instead of simple loading text
   - Implement drag-and-drop for appointment rescheduling
   - Add keyboard navigation for accessibility
   - Include search/filter functionality

3. **Advanced Features**
   - Real-time updates with WebSocket integration
   - Appointment conflict detection and warnings
   - Export functionality (PDF, CSV)
   - Mobile-optimized responsive design

4. **Testing & Quality**
   - Unit tests for service layer and hooks
   - Integration tests for component interactions
   - E2E tests for critical user flows
   - Performance monitoring and optimization

5. **Architecture Enhancements**
   - State management with Zustand/Redux for complex state
   - Error boundaries for better error handling
   - Caching layer for improved performance
   - API integration with proper error handling

---
