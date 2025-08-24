import json
import re

# Read the JSON file
with open('teachers_timetable.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace NaN with null (valid JSON)
content = re.sub(r'\bNaN\b', 'null', content)

# Parse and re-save to ensure valid JSON
try:
    data = json.loads(content)
    with open('teachers_timetable.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print("JSON file fixed successfully!")
except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")

