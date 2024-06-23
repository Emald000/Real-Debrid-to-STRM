function processLinks() {
  const downloadLinks = document.getElementById("downloadLinks").value;
  const linksArray = downloadLinks.split("\n").filter(link => link.trim()); // Split links by newline and filter out empty lines

  const messageElement = document.getElementById("message");
  messageElement.textContent = ""; // Clear previous messages

  const zip = new JSZip(); // Create a new JSZip instance
  let zipNamePrefix = null;

  linksArray.forEach((link) => {
    const fileName = getFileNameFromUrl(link); // Extract and decode filename

    // Extract the base filename without extension
    const lastDotIndex = fileName.lastIndexOf('.');
    const baseName = lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;

    // Extract the part of the filename before SxxExx or sxxexx (case-insensitive)
    const prefixMatch = baseName.match(/(.*)[Ss]\d{2}[Ee]\d{2}/);
    const prefix = prefixMatch ? prefixMatch[1] : null;

    // Determine the common prefix for ZIP file name
    if (zipNamePrefix === null && prefix !== null) {
      zipNamePrefix = prefix;
    } else if (zipNamePrefix !== null && prefix !== null) {
      zipNamePrefix = getCommonPrefix(zipNamePrefix, prefix);
    }

    // Extract season number from filename (case-insensitive)
    const seasonMatch = baseName.match(/[Ss](\d{2})[Ee]/);
    const season = seasonMatch ? parseInt(seasonMatch[1]) : null;

    // Create folder path based on season number (Season X)
    const folderPath = season ? `Season ${season}` : "";
    if (folderPath) {
      zip.folder(folderPath);
    }

    // Add link as a file with .strm extension (within the folder)
    const zipFileName = baseName + ".strm";
    zip.file(folderPath ? `${folderPath}/${zipFileName}` : zipFileName, link, { type: "text/plain" });
  });

  let zipFileName = zipNamePrefix ? cleanUpZipFileName(zipNamePrefix) : "download_links_organized_by_season";

  const year = getYearFromInput();
  if (year) {
    zipFileName += ` (${year})`;
  }
  zipFileName += ".zip";

  zip.generateAsync({ type: "blob" })
     .then(blob => {
       const zipURL = URL.createObjectURL(blob);
       const downloadLink = document.createElement("a");
       downloadLink.href = zipURL;
       downloadLink.download = zipFileName;
       downloadLink.click();
       URL.revokeObjectURL(zipURL);
       messageElement.textContent = "ZIP file with organized download links created.";
     });
}

function getCommonPrefix(str1, str2) {
  let minLength = Math.min(str1.length, str2.length);
  for (let i = 0; i < minLength; i++) {
    if (str1[i] !== str2[i]) {
      return str1.slice(0, i);
    }
  }
  return str1.slice(0, minLength);
}

function cleanUpZipFileName(fileName) {
  // Replace dots with spaces and remove extra dots
  return fileName.replace(/\.+/g, ' ').trim().replace(/\s+/g, ' ');
}

function getFileNameFromUrl(url) {
  // Extract and decode filename from URL
  const parts = url.split("/");
  return decodeURIComponent(parts[parts.length - 1]);
}

// Clear the input when clicked
function clearYearInput() {
  var yearInput = document.getElementById('yearInput');
  if (yearInput.value === 'year') {
    yearInput.value = '';
    yearInput.style.color = 'black';
  }
}

// Reset the input when it loses focus if it's empty
function resetYearInput() {
  var yearInput = document.getElementById('yearInput');
  if (yearInput.value === '') {
    yearInput.value = 'year';
    yearInput.style.color = 'grey';
  }
}

// Function to get the year from the input
function getYearFromInput() {
  var yearInput = document.getElementById('yearInput').value;
  if (yearInput.match(/^\d{4}$/)) {
    return yearInput;
  }
  return '';
}

// Attach event listener to the process links button
document.getElementById('processLinksButton').addEventListener('click', function() {
  processLinks();
});
