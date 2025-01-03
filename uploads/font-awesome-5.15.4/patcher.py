import os
import re
from pathlib import Path

def add_fill_color_to_svg(file_path, color="#05c896"):
    # Read the SVG file
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Add or replace fill color in path elements
    # This regex looks for <path elements and adds or updates the fill attribute
    modified = re.sub(
        r'(<path\s[^>]*?)(?:fill="[^"]*")?([^>]*?>)',
        rf'\1fill="{color}" \2',
        content
    )
    
    # Write the modified content back to the file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(modified)

def process_directory(directory_path, color="#05c896"):
    # Convert string path to Path object
    dir_path = Path(directory_path)
    
    # Find all SVG files in the directory and its subdirectories
    svg_files = list(dir_path.rglob("*.svg"))
    
    print(f"Found {len(svg_files)} SVG files")
    
    # Process each SVG file
    for svg_file in svg_files:
        try:
            print(f"Processing: {svg_file}")
            add_fill_color_to_svg(svg_file, color)
        except Exception as e:
            print(f"Error processing {svg_file}: {str(e)}")

if __name__ == "__main__":
    # Example usage
    directory = "."
    color = "#05c896"
    
    # Confirm before proceeding
    print(f"This will modify all SVG files in {directory} and its subdirectories.")
    response = input("Do you want to proceed? (y/n): ")
    
    if response.lower() == 'y':
        process_directory(directory, color)
        print("Processing complete!")
    else:
        print("Operation cancelled.")
