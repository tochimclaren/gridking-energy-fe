// Types based on your provided schema
interface Download {
    _id: string;
    title: string;
    description?: string;
    url: string;
    fileSize: number;
    mimeType: string;
    refModel?: string;
    refId?: string;
    downloadCount: number;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}