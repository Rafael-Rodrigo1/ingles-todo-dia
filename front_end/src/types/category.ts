export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    orderIndex: number | null;
    active: boolean;
}

export interface CategoryRequest {
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    orderIndex: number;
    active: boolean;
}