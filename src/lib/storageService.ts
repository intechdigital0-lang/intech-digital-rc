import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import imageCompression from 'browser-image-compression';

export const storageService = {
  async uploadImage(file: File, folder: string, onProgress?: (progress: number) => void): Promise<string> {
    console.log(`[Storage] Starting process for ${file.name} (${file.size} bytes) in ${folder}`);
    
    // Skip heavy compression for now to improve reliability in dev environment
    let fileToUpload: File | Blob = file;

    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = ref(storage, `${folder}/${filename}`);
    
    console.log('[Storage] Starting Firebase upload...');
    
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

      // Safety timeout after 45 seconds
      const timeout = setTimeout(() => {
        try {
          uploadTask.cancel();
        } catch (e) {
          console.error('[Storage] Cancel failed:', e);
        }
        reject(new Error('Temps d\'attente dépassé (45s). Vérifiez votre connexion.'));
      }, 45000);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`[Storage] Upload: ${progress.toFixed(1)}%`);
          if (onProgress) onProgress(progress);
        }, 
        (error) => {
          clearTimeout(timeout);
          console.error('[Storage] Upload failed:', error);
          reject(error);
        }, 
        async () => {
          clearTimeout(timeout);
          console.log('[Storage] Success, getting URL...');
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }
};
