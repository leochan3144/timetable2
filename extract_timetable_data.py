import pandas as pd
import json

excel_file = '2526TimetableTeacher250814.xlsx'

def extract_timetable_data(file_path):
    xls = pd.ExcelFile(file_path)
    sheet_names = xls.sheet_names
    all_teachers_data = {}

    for sheet_name in sheet_names:
        df = pd.read_excel(file_path, sheet_name=sheet_name, header=None)

        # Find the row that contains 'Day 1', 'Day 2', etc. as column headers
        timetable_header_row_index = -1
        for i in range(df.shape[0]):
            # Check if 'Day 1' is in the row, assuming it's a consistent marker for the timetable header
            if any('Day 1' in str(cell) for cell in df.iloc[i, :]):
                timetable_header_row_index = i
                break
        
        if timetable_header_row_index == -1:
            print(f"Could not find timetable header row for sheet: {sheet_name}")
            continue

        # The teacher's name is typically in the last non-NaN cell of the row *above* the timetable header
        teacher_name_row_index = timetable_header_row_index - 1
        if teacher_name_row_index >= 0:
            teacher_name_cell = df.iloc[teacher_name_row_index, :].dropna().iloc[-1]
            # Clean up the teacher name by removing the sheet name in parentheses
            teacher_name = str(teacher_name_cell).replace(f' ({sheet_name})', '').strip()
        else:
            teacher_name = sheet_name # Fallback if no row above for teacher name

        # The actual timetable data starts from the row after the timetable header row
        start_row = timetable_header_row_index + 1

        # Extract timetable data from the identified start_row onwards
        timetable_df = df.iloc[start_row:].copy()
        
        # Set the column headers for the timetable_df
        # The first column should be 'Time', and subsequent columns 'Day 1', 'Day 2', etc.
        # We need to find the actual number of day columns from the header row
        num_day_columns = sum('Day' in str(cell) for cell in df.iloc[timetable_header_row_index, :])
        new_columns = ['Time'] + [f'Day {i+1}' for i in range(num_day_columns)]
        
        # Ensure the number of new columns matches the DataFrame's actual columns
        # If there are more columns in the DataFrame than expected days + Time, truncate new_columns
        if len(new_columns) < timetable_df.shape[1]:
            # This handles cases where there might be extra unnamed columns at the end
            new_columns.extend([f'Unnamed_{i}' for i in range(timetable_df.shape[1] - len(new_columns))])
        elif len(new_columns) > timetable_df.shape[1]:
            # This handles cases where there are fewer columns in the DataFrame than expected
            new_columns = new_columns[:timetable_df.shape[1]]

        timetable_df.columns = new_columns
        
        # Drop rows where the 'Time' column (first column) is NaN (empty rows at the end)
        timetable_df.dropna(subset=['Time'], inplace=True)

        # Convert DataFrame to a list of dictionaries for JSON output
        teacher_timetable = timetable_df.to_dict(orient='records')
        all_teachers_data[sheet_name] = {
            'teacher_name': teacher_name,
            'timetable': teacher_timetable
        }

    with open('teachers_timetable.json', 'w', encoding='utf-8') as f:
        json.dump(all_teachers_data, f, ensure_ascii=False, indent=4)

    print("Timetable data extracted and saved to teachers_timetable.json")

if __name__ == '__main__':
    extract_timetable_data(excel_file)


