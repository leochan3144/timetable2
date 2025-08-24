import pandas as pd

excel_file = '2526TimetableTeacher250814.xlsx'

def analyze_excel(file_path):
    xls = pd.ExcelFile(file_path)
    sheet_names = xls.sheet_names
    print(f"Sheet names: {sheet_names}")

    for sheet_name in sheet_names:
        df = pd.read_excel(file_path, sheet_name=sheet_name)
        print(f"\n--- Sheet: {sheet_name} ---")
        print(df.head())
        print(f"Columns: {df.columns.tolist()}")

if __name__ == '__main__':
    analyze_excel(excel_file)


