import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import imageCompression from 'browser-image-compression';

export const storageService = {
  async uploadImage(file: File, folder: string): Promise<string> {
    // Compression options
    const options = {
      maxSizeMB: 0.8, // Reduced for faster compression
      maxWidthOrHeight: 1600, // Reduced for faster compression
      useWebWorker: true,
      initialQuality: 0.8
    };

    let fileToUpload: File | Blob = file;

    try {
      // Compress if it's an image and larger than 1MB
      if (file.type.startsWith('image/') && file.size > 1024 * 1024) {
        fileToUpload = await imageCompression(file, options);
      } else if (file.type.startsWith('image/')) {
        // Light compression for smaller images to ensure they are web-ready
        fileToUpload = await imageCompression(file, { ...options, maxSizeMB: 0.4 });
      }
    } catch (error) {
      console.warn('Compression failed, uploading original file:', error);
      // Fallback to original file if compression fails
      fileToUpload = file;
    }

    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${filename}`);
    
    await uploadBytes(storageRef, fileToUpload);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }
};
