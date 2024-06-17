#!/bin/bash

# Function to replace characters in a filename
replace_in_filename() {
  local filename="$1"
  local new_filename="${filename//%20/ }"  # Replace %20 with space
  new_filename="${new_filename//%28/(}"    # Replace %28 with (
  new_filename="${new_filename//%29/)}"    # Replace %29 with )
  new_filename="${new_filename//%C3%A9/é}"  # Replace %C3%A9 with é (assuming UTF-8 encoding)
  new_filename="${new_filename//%C3%A8/è}"  # Replace %C3%A8 with è (assuming UTF-8 encoding)
  new_filename="${new_filename//%C3%A7/ç}"  # Replace %C3%A7 with ç (assuming UTF-8 encoding)
  new_filename="${new_filename//%5B/[}"    # Replace %5B with [
  new_filename="${new_filename//%5D/]}"    # Replace %5D with ]

  # Rename the file only if the new filename is different
  if [[ "$filename" != "$new_filename" ]]; then
    mv "$filename" "$new_filename"
  fi
}

# Process all files recursively (including subfolders)
find . -type f -exec bash -c 'replace_in_filename "$0"' {} \;

echo "Filename replacements completed!"

