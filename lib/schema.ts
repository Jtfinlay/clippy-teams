export type BlobCorrected = Blob & {
    buffer: Buffer,
}

export enum FileType {
    VIDEO = 'video',
    IMAGE = 'image'
} 