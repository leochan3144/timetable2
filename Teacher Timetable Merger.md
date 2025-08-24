# Teacher Timetable Merger

A web application that allows users to select multiple teachers and view their merged timetables in a unified view. This tool helps visualize when selected teachers are available or busy across the 6-day school cycle.

## Features

- **Multi-Teacher Selection**: Select multiple teachers using checkboxes with search functionality
- **Merged Timetable View**: Visual grid showing combined schedules of selected teachers
- **Color-Coded Display**: 
  - 🟢 Green: Free periods (no selected teachers have classes)
  - 🔵 Blue: Single teacher teaching
  - 🔴 Red: Multiple teachers teaching (potential conflicts)
  - ⚫ Gray: Break times (Recess, Lunch, Roll Call)
- **Search Functionality**: Quickly find teachers by name or code
- **Responsive Design**: Works on both desktop and mobile devices
- **Real-time Updates**: Timetable updates automatically when teachers are selected/deselected

## Files Structure

```
teacher-timetable-merger/
├── index.html              # Main HTML file
├── styles.css              # CSS styling
├── script.js               # JavaScript functionality
├── teachers_timetable.json  # Teacher data (extracted from Excel)
├── README.md               # This file
└── data-extraction/
    ├── 2526TimetableTeacher250814.xlsx  # Original Excel file
    ├── extract_timetable_data.py        # Data extraction script
    └── fix_json_data.py                 # JSON cleanup script
```

## Getting Started

### Option 1: Simple File Opening
1. Download all files to a local directory
2. Open `index.html` in a web browser
3. **Note**: Due to browser security restrictions, you may need to serve the files via HTTP

### Option 2: Local HTTP Server (Recommended)
1. Download all files to a local directory
2. Open terminal/command prompt in the directory
3. Run a local HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if you have http-server installed)
   npx http-server
   ```
4. Open your browser and navigate to `http://localhost:8000`

### Option 3: GitHub Pages Deployment
1. Upload files to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Access via the provided GitHub Pages URL

## Usage Instructions

1. **Select Teachers**: 
   - Use checkboxes to select one or more teachers
   - Use the search box to quickly find specific teachers
   - Use "Select All" or "Clear All" buttons for bulk operations

2. **View Merged Timetable**:
   - The timetable automatically updates when teachers are selected
   - Each cell shows the activities for the selected teachers at that time
   - Color coding helps identify conflicts and free periods

3. **Interpret the Display**:
   - **Free periods**: Green cells indicate no selected teachers have classes
   - **Single teacher**: Blue cells show one teacher's class information
   - **Multiple teachers**: Red cells show multiple teachers teaching (potential scheduling conflicts)
   - **Break times**: Gray cells for universal break periods

## Data Source

The application uses data extracted from `2526TimetableTeacher250814.xlsx`, which contains timetables for 59 teachers across a 6-day school cycle. The data includes:

- Teacher names and codes
- Daily schedules with time slots
- Class information (subject, room, students)
- Break periods (Recess, Lunch, Roll Call)

## Technical Details

### Technologies Used
- **HTML5**: Structure and semantic markup
- **CSS3**: Styling with responsive design and modern UI
- **Vanilla JavaScript**: Functionality without external dependencies
- **JSON**: Data storage format

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- Handles 59 teachers with 14 time slots across 6 days
- Real-time filtering and merging
- Optimized for smooth user interactions

## Data Extraction Process

The original Excel file was processed using Python scripts:

1. **extract_timetable_data.py**: Extracts teacher data from Excel sheets
2. **fix_json_data.py**: Cleans up JSON format (replaces NaN with null)

To re-extract data from a new Excel file:
```bash
python extract_timetable_data.py
python fix_json_data.py
```

## Customization

### Adding New Teachers
1. Update the Excel file with new teacher data
2. Run the extraction scripts
3. Replace `teachers_timetable.json` with the new data

### Styling Changes
- Modify `styles.css` to change colors, fonts, or layout
- CSS variables are used for easy theme customization

### Functionality Extensions
- Edit `script.js` to add new features
- The modular structure makes it easy to extend functionality

## Troubleshooting

### Common Issues

1. **Blank teacher list**: 
   - Ensure `teachers_timetable.json` is in the same directory
   - Check browser console for errors
   - Serve files via HTTP server instead of opening directly

2. **Timetable not displaying**:
   - Verify JSON file format is valid
   - Check that teachers are properly selected
   - Ensure JavaScript is enabled in browser

3. **Search not working**:
   - Clear browser cache
   - Check for JavaScript errors in console

### Browser Console Errors
If you encounter issues, open browser developer tools (F12) and check the console for error messages.

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.

## Support

For questions or support, please create an issue in the repository or contact the development team.

