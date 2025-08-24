// Global variables
let teachersData = {};
let selectedTeachers = new Set();

// DOM elements
const teacherList = document.getElementById('teacherList');
const selectedCount = document.getElementById('selectedCount');
const timetable = document.getElementById('timetable');
const teacherSearch = document.getElementById('teacherSearch');
const selectAllBtn = document.getElementById('selectAll');
const clearAllBtn = document.getElementById('clearAll');

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadTeacherData();
        renderTeacherList();
        renderTimetable();
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing application:', error);
        showError('Failed to load teacher data. Please check if the data file exists.');
    }
});

// Load teacher data from JSON file
async function loadTeacherData() {
    try {
        const response = await fetch('teachers_timetable.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        teachersData = await response.json();
        console.log('Loaded teacher data:', Object.keys(teachersData).length, 'teachers');
    } catch (error) {
        console.error('Error loading teacher data:', error);
        throw error;
    }
}

// Render the teacher selection list
function renderTeacherList(searchTerm = '') {
    teacherList.innerHTML = '';
    
    const teachers = Object.entries(teachersData).filter(([code, data]) => {
        const searchLower = searchTerm.toLowerCase();
        return data.teacher_name.toLowerCase().includes(searchLower) ||
               code.toLowerCase().includes(searchLower);
    });

    teachers.forEach(([code, data]) => {
        const teacherItem = document.createElement('div');
        teacherItem.className = 'teacher-item';
        teacherItem.innerHTML = `
            <input type="checkbox" id="teacher-${code}" ${selectedTeachers.has(code) ? 'checked' : ''}>
            <label for="teacher-${code}" class="teacher-name">${data.teacher_name}</label>
            <span class="teacher-code">${code}</span>
        `;

        const checkbox = teacherItem.querySelector('input');
        checkbox.addEventListener('change', () => toggleTeacher(code));
        
        teacherItem.addEventListener('click', (e) => {
            if (e.target.type !== 'checkbox') {
                checkbox.checked = !checkbox.checked;
                toggleTeacher(code);
            }
        });

        if (selectedTeachers.has(code)) {
            teacherItem.classList.add('selected');
        }

        teacherList.appendChild(teacherItem);
    });

    updateSelectedCount();
}

// Toggle teacher selection
function toggleTeacher(teacherCode) {
    if (selectedTeachers.has(teacherCode)) {
        selectedTeachers.delete(teacherCode);
    } else {
        selectedTeachers.add(teacherCode);
    }
    
    updateSelectedCount();
    renderTimetable();
    updateTeacherItemStyles();
}

// Update selected teacher count display
function updateSelectedCount() {
    const count = selectedTeachers.size;
    selectedCount.textContent = `${count} teacher${count !== 1 ? 's' : ''} selected`;
}

// Update teacher item visual styles
function updateTeacherItemStyles() {
    const teacherItems = document.querySelectorAll('.teacher-item');
    teacherItems.forEach(item => {
        const checkbox = item.querySelector('input');
        const teacherCode = checkbox.id.replace('teacher-', '');
        
        if (selectedTeachers.has(teacherCode)) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// Get time slots from the first teacher's data
function getTimeSlots() {
    const firstTeacher = Object.values(teachersData)[0];
    if (!firstTeacher || !firstTeacher.timetable) return [];
    
    return firstTeacher.timetable.map(slot => slot.Time).filter(time => time);
}

// Render the merged timetable
function renderTimetable() {
    timetable.innerHTML = '';
    
    if (selectedTeachers.size === 0) {
        timetable.innerHTML = `
            <div class="empty-state">
                <h3>No teachers selected</h3>
                <p>Please select one or more teachers to view their merged timetable.</p>
            </div>
        `;
        return;
    }

    const timeSlots = getTimeSlots();
    const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];

    // Create header row
    const headerRow = document.createElement('div');
    headerRow.className = 'timetable-cell timetable-header-cell';
    headerRow.textContent = 'Time';
    timetable.appendChild(headerRow);

    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'timetable-cell timetable-header-cell';
        dayHeader.textContent = day;
        timetable.appendChild(dayHeader);
    });

    // Create time slot rows
    timeSlots.forEach(timeSlot => {
        // Time cell
        const timeCell = document.createElement('div');
        timeCell.className = 'timetable-cell time-cell';
        timeCell.textContent = timeSlot.replace('\n', ' ');
        timetable.appendChild(timeCell);

        // Day cells
        days.forEach(day => {
            const dayCell = document.createElement('div');
            dayCell.className = 'timetable-cell';
            
            const cellData = getMergedCellData(timeSlot, day);
            dayCell.innerHTML = cellData.content;
            dayCell.className += ` ${cellData.className}`;
            
            timetable.appendChild(dayCell);
        });
    });

    timetable.classList.add('fade-in');
}

// Get merged cell data for a specific time slot and day
function getMergedCellData(timeSlot, day) {
    const teachersInSlot = [];
    
    selectedTeachers.forEach(teacherCode => {
        const teacher = teachersData[teacherCode];
        if (!teacher || !teacher.timetable) return;
        
        const slot = teacher.timetable.find(s => s.Time === timeSlot);
        if (!slot) return;
        
        const activity = slot[day];
        if (activity && activity !== 'NaN' && activity !== null && activity !== undefined) {
            teachersInSlot.push({
                name: teacher.teacher_name,
                code: teacherCode,
                activity: activity.toString().trim()
            });
        }
    });

    // Determine cell type and content
    if (teachersInSlot.length === 0) {
        return {
            content: '<div class="cell-content">Free</div>',
            className: 'cell-free'
        };
    }

    // Check if it's a break time (common activities)
    const breakActivities = ['Recess', 'Lunch', 'Roll Call', 'Class Period'];
    const isBreak = teachersInSlot.every(t => breakActivities.includes(t.activity));
    
    if (isBreak) {
        return {
            content: `<div class="cell-content">${teachersInSlot[0].activity}</div>`,
            className: 'cell-break'
        };
    }

    if (teachersInSlot.length === 1) {
        const teacher = teachersInSlot[0];
        return {
            content: `
                <div class="cell-content">
                    <div class="teacher-info">${teacher.code}</div>
                    <div class="class-info">${teacher.activity}</div>
                </div>
            `,
            className: 'cell-single'
        };
    }

    // Multiple teachers
    const content = teachersInSlot.map(teacher => `
        <div class="teacher-info">${teacher.code}</div>
        <div class="class-info">${teacher.activity}</div>
    `).join('');

    return {
        content: `<div class="cell-content">${content}</div>`,
        className: 'cell-multiple'
    };
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    teacherSearch.addEventListener('input', (e) => {
        renderTeacherList(e.target.value);
    });

    // Select all button
    selectAllBtn.addEventListener('click', () => {
        const allTeachers = Object.keys(teachersData);
        selectedTeachers = new Set(allTeachers);
        renderTeacherList(teacherSearch.value);
        renderTimetable();
    });

    // Clear all button
    clearAllBtn.addEventListener('click', () => {
        selectedTeachers.clear();
        renderTeacherList(teacherSearch.value);
        renderTimetable();
    });
}

// Show error message
function showError(message) {
    timetable.innerHTML = `
        <div class="empty-state">
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
}

