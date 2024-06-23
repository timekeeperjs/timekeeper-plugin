import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'dist/assets');

// Function to upload a file
const uploadFile = async (filePath) => {
  try {
    const fileStream = await fs.readFile(filePath);
    const form = new FormData();
    form.append('file', fileStream, path.basename(filePath));

    const response = await axios.post('http://localhost:7777/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    console.log(`Uploaded ${filePath}: ${response.status}`);
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error.message);
  }
};

// Read directory and upload each .remoteEntry.js file
const uploadFiles = async () => {
  try {
    const files = await fs.readdir(directoryPath);

    for (const file of files) {
      if (file.endsWith('.remoteEntry.js')) {
        const filePath = path.join(directoryPath, file);
        await uploadFile(filePath);
      }
    }
  } catch (err) {
    console.error('Unable to scan directory:', err);
  }
};

uploadFiles();