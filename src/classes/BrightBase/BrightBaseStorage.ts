import debug from 'debug'
import brightBaseSingleton from './BrightBaseSingleton'
import { Upload } from 'tus-js-client'

const log = debug('brightbase:storage')

export default class BrightBaseStorage {
  private storage: ReturnType<typeof brightBaseSingleton.getSupabase>['storage']
  private bucketName: string

  /**
   * Creates an instance of BrightBaseStorage.
   * @param {string} bucketName - The name of the bucket to operate on.
   * @example
   * const storage = new BrightBaseStorage('my-bucket');
   */
  constructor(bucketName: string) {
    this.storage = brightBaseSingleton.getSupabase().storage
    this.bucketName = bucketName
    log('BrightBaseStorage created for bucket:', bucketName)
  }

  first(callback: () => void): this {
    try {
      callback()
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message)
      }
      throw new Error('Unknown error')
    }
    return this
  }

  /**
   * Generates a public URL for a file in the specified path in the bucket.
   * @param {string} path - The path where the file is stored in the bucket.
   * @returns {string} The public URL of the file.
   * @example
   * const url = storage.getPublicUrl('folder/my-file.txt');
   */
  getPublicUrl(path: string): string {
    const {
      data: { publicUrl },
    } = this.storage.from(this.bucketName).getPublicUrl(path)
    log('Generated public URL for bucket "%s" at path "%s": %s', this.bucketName, path, publicUrl)
    return publicUrl
  }

  /**
   * Uploads a file to the specified path in the bucket with progress tracking using tus-js-client.
   * @param {string} path - The path where the file will be stored in the bucket.
   * @param {File | Blob} file - The file or blob to upload.
   * @param {(progress: number) => void} [onProgress] - Optional callback function to track upload progress.
   * @returns {Promise<string>} The public URL of the uploaded file.
   * @throws {Error} If there is an error during the upload.
   * @example
   * storage.uploadFile('folder/my-file.txt', fileBlob, (progress) => console.log('Progress:', progress))
   *   .then(url => console.log(url))
   *   .catch(err => console.error(err))
   */
  async uploadFile(path: string, file: File | Blob, onProgress?: (progress: number) => void): Promise<string> {
    const {
      data: { session },
    } = await brightBaseSingleton.getSupabase().auth.getSession()
    if (!session) throw new Error('User must be authenticated to upload files')
    return new Promise((resolve, reject) => {
      const upload = new Upload(file, {
        endpoint: `${brightBaseSingleton.getSupabaseUrl()}/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${session.access_token}`,
          'x-upsert': 'true', // Optionally set upsert to true to overwrite existing files
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: this.bucketName,
          objectName: path,
          contentType: file.type || 'application/octet-stream',
          cacheControl: '3600',
        },
        chunkSize: 6 * 1024 * 1024, // Must be set to 6MB
        onError: function (error) {
          log('Upload failed:', error)
          reject(error)
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
          log('Upload progress:', percentage + '%')
          if (onProgress) onProgress(Number(percentage))
        },
        onSuccess: () => {
          const publicUrl = this.getPublicUrl(path)
          log('File uploaded to bucket "%s" at path "%s". Public URL: %s', this.bucketName, path, publicUrl)
          resolve(publicUrl)
        },
      })

      // Check if there are any previous uploads to continue.
      upload.findPreviousUploads().then(function (previousUploads) {
        // Found previous uploads so we select the first one.
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0])
        }

        // Start the upload
        upload.start()
      })
    })
  }

  /**
   * Downloads a file from the specified path in the bucket.
   * @param {string} path - The path where the file is stored in the bucket.
   * @returns {Promise<Blob>} The downloaded file as a Blob.
   * @throws {Error} If there is an error during the download.
   * @example
   * storage.downloadFile('folder/my-file.txt').then(fileBlob => {
   *   const url = URL.createObjectURL(fileBlob);
   *   window.open(url);
   * }).catch(err => console.error(err));
   */
  async downloadFile(path: string): Promise<Blob> {
    const { data, error } = await this.storage.from(this.bucketName).download(path)

    if (error) {
      log('Error downloading file from bucket "%s": %s', this.bucketName, error.message)
      throw new Error(error.message)
    }

    log('File downloaded from bucket "%s" at path "%s"', this.bucketName, path)
    return data as Blob
  }

  /**
   * Deletes a file from the specified path in the bucket.
   * @param {string} path - The path of the file to delete.
   * @returns {Promise<void>} Resolves when the file is deleted.
   * @throws {Error} If there is an error during deletion.
   * @example
   * storage.deleteFile('folder/my-file.txt').then(() => console.log('File deleted')).catch(err => console.error(err));
   */
  async deleteFile(path: string): Promise<void> {
    const { error } = await this.storage.from(this.bucketName).remove([path])

    if (error) {
      log('Error deleting file from bucket "%s": %s', this.bucketName, error.message)
      throw new Error(error.message)
    }

    log('File deleted from bucket "%s" at path "%s"', this.bucketName, path)
  }

  /**
   * Lists files in the specified path in the bucket.
   * @param {string} [path=''] - The folder path to list files from. Defaults to the root.
   * @returns {Promise<{ name: string; id: string; metadata: object; }[]>} An array of file objects.
   * @throws {Error} If there is an error during listing.
   * @example
   * storage.listFiles('folder/').then(files => console.log(files)).catch(err => console.error(err));
   */
  async listFiles(path: string = ''): Promise<{ name: string; id: string; metadata: object }[]> {
    const { data, error } = await this.storage.from(this.bucketName).list(path)

    if (error) {
      log('Error listing files from bucket "%s" at path "%s": %s', this.bucketName, path, error.message)
      throw new Error(error.message)
    }

    log('Files listed from bucket "%s" at path "%s": %o', this.bucketName, path, data)
    return data as { name: string; id: string; metadata: object }[]
  }
}
