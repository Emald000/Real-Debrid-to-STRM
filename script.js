function processLinks() {
  const downloadLinks = document.getElementById("downloadLinks").value;
  const linksArray = downloadLinks.split("\n"); // Split links by newline

  const messageElement = document.getElementById("message");
  messageElement.textContent = ""; // Clear previous messages

  const zip = new JSZip(); // Create a new JSZip instance

  linksArray.forEach((link) => {
    const urlParts = link.split("/"); // Split URL by "/"
    const fileName = decodeURIComponent(urlParts[urlParts.length - 1]); // Extract and decode filename

    // Extract the base filename without extension
    const lastDotIndex = fileName.lastIndexOf('.');
    const baseName = lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;

    // Extract season number from filename (assuming S and two numbers format)
    const seasonMatch = baseName.match(/S(\d{2})E/);
    const season = seasonMatch ? parseInt(seasonMatch[1]) : null;

    // Create folder path based on season number (Season X)
    const folderPath = season ? `Season ${season}` : ""; 
    zip.folder(folderPath);

    // Add link as a file with .strm extension (within the folder)
    const zipFileName = baseName + ".strm";
    zip.file(folderPath + "/" + zipFileName, link, { type: "text/plain" });
  });

  zip.generateAsync({ type: "blob" })
     .then(blob => {
       const zipURL = URL.createObjectURL(blob);
       const downloadLink = document.createElement("a");
       downloadLink.href = zipURL;
       downloadLink.download = "download_links_organized_by_season.zip";
       downloadLink.click();
       URL.revokeObjectURL(zipURL);
       messageElement.textContent = "ZIP file with organized download links created.";
     });
}

function getFileNameFromUrl(url) {
  // Extract and decode filename from URL (basic implementation)
  const parts = url.split("/");
  return decodeURIComponent(parts[parts.length - 1]); 
}

