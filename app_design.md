# Teacher Timetable Merger App - Design Document

## Application Overview
A web application that allows users to select multiple teachers and view their merged timetables in a unified view. The app will help visualize when selected teachers are available or busy across the 6-day school cycle.

## Key Features
1. **Teacher Selection Interface**: Multi-select dropdown or checkbox list for choosing teachers
2. **Merged Timetable Display**: Grid showing combined schedules of selected teachers
3. **Visual Indicators**: Color coding to show conflicts, free periods, and common activities
4. **Responsive Design**: Works on both desktop and mobile devices

## User Interface Design

### Layout Structure
```
┌─────────────────────────────────────────┐
│              Header                     │
│        Teacher Timetable Merger         │
├─────────────────────────────────────────┤
│          Teacher Selection              │
│    [Select Teachers Dropdown/List]      │
│         [Merge Button]                  │
├─────────────────────────────────────────┤
│           Merged Timetable              │
│  Time  │ Day 1 │ Day 2 │ ... │ Day 6   │
│ 08:25  │       │       │     │         │
│ 09:00  │       │       │     │         │
│  ...   │       │       │     │         │
└─────────────────────────────────────────┘
```

### Color Scheme
- **Primary**: #2563eb (Blue) - for headers and primary actions
- **Secondary**: #64748b (Slate) - for secondary text
- **Success**: #10b981 (Green) - for free periods
- **Warning**: #f59e0b (Amber) - for conflicts/overlaps
- **Background**: #f8fafc (Light gray)
- **White**: #ffffff - for content areas

### Teacher Selection Component
- Multi-select dropdown with search functionality
- Checkboxes for easy selection/deselection
- "Select All" and "Clear All" options
- Display selected teacher count

### Merged Timetable Display
- Grid layout with time slots as rows and days as columns
- Each cell shows:
  - Teacher name(s) if teaching
  - Subject/class information
  - Room number
- Color coding:
  - Green: Free period (no teachers selected have classes)
  - Blue: Single teacher teaching
  - Red: Multiple teachers teaching (potential conflict)
  - Gray: Break times (Recess, Lunch, Roll Call)

### Interactive Features
- Hover effects on teacher selection items
- Smooth transitions when updating the timetable
- Responsive grid that adapts to screen size
- Tooltip showing full class details on hover

## Technical Architecture

### Data Structure
- JSON file containing all teacher timetables
- Each teacher has:
  - Teacher name
  - Timetable array with time slots and daily schedules

### Core Functions
1. `loadTeacherData()` - Load JSON data
2. `renderTeacherList()` - Display teacher selection interface
3. `mergeTimetables()` - Combine selected teachers' schedules
4. `renderMergedTimetable()` - Display the merged view
5. `updateSelection()` - Handle teacher selection changes

### Responsive Design
- Mobile-first approach
- Collapsible teacher selection on mobile
- Horizontal scroll for timetable on small screens
- Touch-friendly interface elements

## User Experience Flow
1. User opens the application
2. Sees list of all available teachers
3. Selects multiple teachers using checkboxes or dropdown
4. Clicks "Merge Timetables" or auto-updates on selection
5. Views the merged timetable with visual indicators
6. Can modify selection and see updated results immediately

