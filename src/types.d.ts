// src/types.d.ts

interface Props {
    // Define common props if any, otherwise keep empty
}

interface IItem {
    _id: string;
    title: string;
    slug: string;
    img: string;
    price: number;
    discount?: number; // Optional, as it's checked with parseInt(item.discount) > 0
    createdAt: string;
    published: boolean;
    description?: string;
    category?: string; // Assuming category is a string ID
    // Add other properties as needed
}

interface IOrder {
    _id: string;
    invoice: string; // Assuming this links to an invoice ID
    slug: string; // Product slug
    quantity: number;
    price: number;
    discount?: number;
    details?: Record<string, any>; // For chosenDetails
    createdAt: string;
    status: string;
    user: string; // User ID
    // Add other properties as needed
}

interface IInvoice {
    _id: string;
    status: string;
    createdAt: string;
    user: string; // User ID
    price: number;
    // Add other properties as needed
}

interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    telephone: string;
    visitor: string; // Fingerprint ID or similar
    createdAt: string;
    isAdmin: boolean;
    // Add other properties as needed
}

interface IBanner {
    name: string;
    title: string;
    arabicTitle: string;
    img: string;
    // Add other properties as needed
}

interface IAction {
    description: string;
    visitor: string;
    createdAt: string;
    // Add other properties as needed
}

interface IPost {
    _id: string;
    title: string;
    post: string; // Content of the post
    pic: string; // Image file name
    createdAt: string;
    // Add other properties as needed
}

interface ICommentForm {
    // Define properties for comments if needed
}

interface ICollection {
    id?: number; // Optional local ID for excel import, _id for backend
    _id?: string; // Backend ID
    name: string;
    arabicName: string;
    slug: string;
    active: boolean;
    imgFile: File | null;
    imgPreview: string | null;
    // Add other properties as needed
}

interface IProductDetail {
    item: string; // Product ID
    // Add other chosen details properties
}

interface IChosenDetail {
    [key: string]: string; // e.g., { color: 'red', size: 'M' }
}

interface ISlug {
    _id: string;
    code: string;
    category: string;
    // Add other properties as needed
}

interface ICategory {
    _id: string;
    name: string;
    // Add other properties as needed
}

interface IPostForm {
    title: string;
    post: string;
    // Add other properties as needed
}

type attributesType = {
    // Define properties for attributesType if needed
    // Based on usage, it seems to be an object with string keys and values
    [key: string]: string;
};

interface ICartItem {
    _id: string;
    quantity: number;
    price: number;
    discount?: number;
    chosenDetails?: IChosenDetail;
    // Add other properties from IItem that might be stored in cart
    title: string;
    img: string;
    slug: string;
    description?: string;
}