export interface IStorageService {
  getUploadUrl(
    folder: string,
    fileName: string,
    contentType: string,
  ): Promise<{ url: string; key: string }>;

  getDownloadUrl(key: string): Promise<string>;

  deleteFile(key: string): Promise<void>;
}

export const IStorageService = Symbol('IStorageService');
