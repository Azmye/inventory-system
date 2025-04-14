import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Store {
    id: number;
    user_id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
    email: string;
    website: string;
    products: Product[];
    stocks: Stock[];
    stockTransactions: StockTransaction[];
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    store_id: number;
    name: string;
    products: Product[];
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    store_id: number;
    category_id: number;
    name: string;
    description: string;
    sku: string;
    barcode: string;
    price: number;
    cost: number;
    tax: number;
    weight: number;
    image: string;
    status: string;
    stockTransactions: StockTransaction[];
    category: Category;
    current_stock: number;
    created_at: string;
    updated_at: string;
}

export interface Stock {
    id: number;
    store_id: number;
    product_id: number;
    product: Product;
    quantity: number;
    reorder_level: number;
    location: string;
    created_at: string;
    updated_at: string;
}

export interface StockTransaction {
    id: number;
    store_id: number;
    product_id: number;
    user_id: number;
    user: User;
    quantity: number;
    type: string;
    reference: string;
    notes: string;
    created_at: string;
    updated_at: string;
}
