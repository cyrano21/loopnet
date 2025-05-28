// ...existing code...
export interface Property {
  _id: string;
  title: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
  };
  images: string[];
  propertyType: string;
  size: number;
  bedrooms?: number;
  bathrooms?: number;
  description: string;
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}
// ...existing code...