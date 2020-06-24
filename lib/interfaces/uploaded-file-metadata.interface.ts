export interface UploadedFileMetadata {
  /** Field name specified in the form */
  fieldname: string;
  /** Name of the file on the user's computer */
  originalname: string;
  /** Encoding type of the file */
  encoding: string;
  /** Mime type of the file */
  mimetype: string;
  /** Size of the file in bytes */
  size: number;
  /** A Buffer of the entire file (MemoryStorage) */
  buffer: Buffer;

  /** Url of uploaded file. */
  url?: string;
  /** Custom OSS bucket. */
  bucket?: string;
  /** Custom filename. */
  customName?: string;
  /** Custom folder in OSS bucket. */
  folder?: string;
}
