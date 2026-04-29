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
      // ONLY compress if it's an image and actually needs compression (> 500KB)
      if (file.type.startsWith('image/') && file.size > 500 * 1024) {
        fileToUpload = await imageCompression(file, options);
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
