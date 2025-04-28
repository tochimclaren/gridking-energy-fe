interface Gallery {
    _id: string;
    name: string;
    description?: string;
    user?: Types.ObjectId;
    isPublic: boolean;
    createdAt?: Date 
    updatedAt?: Date 
    images?:string[]
}
