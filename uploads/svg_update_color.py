import os
from xml.etree import ElementTree as ET
import re

def add_fill_to_svg(file_path, fill_color="#05c896"):
    # Read the file content
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Parse the SVG
    # First, register the namespace to avoid the default ns0 prefix
    ET.register_namespace('', "http://www.w3.org/2000/svg")
    root = ET.fromstring(content)
    
    # Add fill to the path elements if they don't have it
    for path in root.findall('.//{http://www.w3.org/2000/svg}path'):
        if 'fill' not in path.attrib:
            path.set('fill', fill_color)
    
    # Convert back to string
    modified_content = ET.tostring(root, encoding='unicode')
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(modified_content)

def process_directory(directory_path):
    # Count for reporting
    total_files = 0
    modified_files = 0
    
    # Walk through directory
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            if file.endswith('.svg'):
                total_files += 1
                file_path = os.path.join(root, file)
                try:
                    add_fill_to_svg(file_path)
                    modified_files += 1
                    print(f"Modified: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {str(e)}")
    
    print(f"\nProcess completed!")
    print(f"Total SVG files found: {total_files}")
    print(f"Successfully modified: {modified_files}")

# Usage
directory_path = "font-awesome-6.7.2/"
process_directory(directory_path)
