export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  description: string;
}

export interface Supplier {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  products: Product[];
}

export const SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: "Cumboots Milk",
    description: "Family-run dairy farm producing fresh milk and dairy products daily.",
    latitude: 54.28,
    longitude: -0.45,
    category: "Dairy",
    products: [
      { id: 1, name: "Whole Milk", price: 1.20, unit: "per litre", description: "Fresh full-fat milk from our herd" },
      { id: 2, name: "Semi-Skimmed Milk", price: 1.10, unit: "per litre", description: "Light and fresh" },
      { id: 3, name: "Salted Butter", price: 2.80, unit: "250g", description: "Creamy hand-churned butter" },
      { id: 4, name: "Double Cream", price: 1.80, unit: "300ml", description: "Rich and thick" },
    ],
  },
  {
    id: 2,
    name: "Bagles Lady",
    description: "Freshly baked bagels and breads made every morning from local flour.",
    latitude: 54.28,
    longitude: -0.426,
    category: "Bakery",
    products: [
      { id: 1, name: "Plain Bagel", price: 0.80, unit: "each", description: "Classic soft bagel" },
      { id: 2, name: "Sesame Bagel", price: 0.90, unit: "each", description: "Topped with toasted sesame seeds" },
      { id: 3, name: "Sourdough Loaf", price: 3.50, unit: "per loaf", description: "Long-fermented sourdough" },
      { id: 4, name: "Bagel Six-Pack", price: 4.20, unit: "6 pack", description: "Mixed selection of fresh bagels" },
    ],
  },
  {
    id: 3,
    name: "Spence Butchers",
    description: "Traditional butchers sourcing only from local farms within 20 miles.",
    latitude: 54.28,
    longitude: -0.404,
    category: "Meat",
    products: [
      { id: 1, name: "Beef Mince", price: 4.50, unit: "500g", description: "Lean local beef mince" },
      { id: 2, name: "Pork Sausages", price: 3.80, unit: "6 pack", description: "Traditional pork sausages" },
      { id: 3, name: "Chicken Breast", price: 5.20, unit: "per kg", description: "Free-range chicken breast" },
      { id: 4, name: "Lamb Chops", price: 7.00, unit: "4 pack", description: "Local lamb, dry-aged" },
    ],
  },
];
