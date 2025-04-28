interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    children?: Category[]
    parent?: string;
    ancestors?: any[];
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
  }