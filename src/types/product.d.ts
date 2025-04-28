interface Product {
    _id: string;
    name: string;
    slug: string;
    id:string;
    images?:string[]
    category: Category;
    updatedAt: Date;
    createdAt: Date;
    status: string;
    attributes: any[];
    images: string[];
}
interface ProductApiResponse {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    category: Category | string;
    updatedAt: Date;
    createdAt: Date;
    status: string;
    attributes: { name: string; value: string }[];
    images: string[];
}