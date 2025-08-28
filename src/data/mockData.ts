export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image?: string;
  available: boolean;
  rating: number;
  reviews: number;
  isPopular?: boolean;
  preparationTime: string;
  canteen: 'GCR' | 'DMS' | 'SFC';
}

export interface Canteen {
  id: string;
  name: string;
  fullName: string;
  description: string;
  image: string;
  color: string;
  hours: string;
  location: string;
  specialties: string[];
}

export interface Order {
  id: string;
  items: {
    menuItem: MenuItem;
    quantity: number;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  orderTime: Date;
  canteen: string;
}

export const canteens: Canteen[] = [
  {
    id: 'gcr',
    name: 'GCR',
    fullName: 'Graduate Common Room',
    description: 'Fresh and healthy meals with traditional Pakistani cuisine',
    image: '/src/assets/gcr-canteen.jpg',
    color: 'gcr',
    hours: '8:00 AM - 6:00 PM',
    location: 'Main Campus, Block A',
    specialties: ['Traditional Pakistani Food', 'Fresh Juices', 'Healthy Options']
  },
  {
    id: 'dms',
    name: 'DMS',
    fullName: 'Department of Management Sciences',
    description: 'Modern cuisine with quick service for busy students',
    image: '/src/assets/dms-canteen.jpg',
    color: 'dms',
    hours: '7:30 AM - 7:00 PM',
    location: 'DMS Building, 2nd Floor',
    specialties: ['Fast Food', 'Continental', 'Coffee & Beverages']
  },
  {
    id: 'sfc',
    name: 'SFC',
    fullName: 'Student Faculty Center',
    description: 'Cozy atmosphere with comfort food and snacks',
    image: '/src/assets/sfc-canteen.jpg',
    color: 'sfc',
    hours: '9:00 AM - 5:00 PM',
    location: 'Student Center, Ground Floor',
    specialties: ['Comfort Food', 'Snacks', 'Regional Cuisine']
  }
];

export const menuItems: MenuItem[] = [
  // GCR Items
  {
    id: 'gcr-1',
    name: 'Chicken Biryani',
    price: 280,
    description: 'Aromatic basmati rice with tender chicken pieces, served with raita and shorba',
    category: 'Main Course',
    available: true,
    rating: 4.8,
    reviews: 156,
    isPopular: true,
    preparationTime: '15-20 mins',
    canteen: 'GCR'
  },
  {
    id: 'gcr-2',
    name: 'Beef Karahi',
    price: 320,
    description: 'Spicy beef cooked with tomatoes, green chilies, and traditional spices',
    category: 'Main Course',
    available: true,
    rating: 4.6,
    reviews: 89,
    preparationTime: '20-25 mins',
    canteen: 'GCR'
  },
  {
    id: 'gcr-3',
    name: 'Daal Chawal',
    price: 150,
    description: 'Traditional lentil curry served with steamed basmati rice',
    category: 'Main Course',
    available: true,
    rating: 4.3,
    reviews: 234,
    preparationTime: '10-15 mins',
    canteen: 'GCR'
  },
  {
    id: 'gcr-4',
    name: 'Chicken Tikka',
    price: 200,
    description: 'Grilled chicken pieces marinated in yogurt and spices',
    category: 'BBQ',
    available: true,
    rating: 4.7,
    reviews: 123,
    preparationTime: '15-20 mins',
    canteen: 'GCR'
  },
  {
    id: 'gcr-5',
    name: 'Fresh Orange Juice',
    price: 80,
    description: 'Freshly squeezed orange juice',
    category: 'Beverages',
    available: true,
    rating: 4.5,
    reviews: 67,
    preparationTime: '2-3 mins',
    canteen: 'GCR'
  },
  {
    id: 'gcr-6',
    name: 'Chapati Roll',
    price: 120,
    description: 'Chicken or beef roll wrapped in fresh chapati with vegetables',
    category: 'Fast Food',
    available: true,
    rating: 4.4,
    reviews: 198,
    preparationTime: '8-10 mins',
    canteen: 'GCR'
  },
  {
    id: 'gcr-7',
    name: 'Vegetable Pulao',
    price: 180,
    description: 'Fragrant rice cooked with mixed vegetables and mild spices',
    category: 'Main Course',
    available: false,
    rating: 4.2,
    reviews: 45,
    preparationTime: '15-18 mins',
    canteen: 'GCR'
  },

  // DMS Items
  {
    id: 'dms-1',
    name: 'Club Sandwich',
    price: 250,
    description: 'Triple-layer sandwich with chicken, cheese, lettuce, and tomatoes',
    category: 'Sandwiches',
    available: true,
    rating: 4.6,
    reviews: 142,
    isPopular: true,
    preparationTime: '5-8 mins',
    canteen: 'DMS'
  },
  {
    id: 'dms-2',
    name: 'Chicken Burger',
    price: 300,
    description: 'Grilled chicken patty with cheese, lettuce, and special sauce',
    category: 'Burgers',
    available: true,
    rating: 4.5,
    reviews: 187,
    preparationTime: '10-12 mins',
    canteen: 'DMS'
  },
  {
    id: 'dms-3',
    name: 'Beef Pizza Slice',
    price: 180,
    description: 'Thin crust pizza slice with beef pepperoni and mozzarella',
    category: 'Pizza',
    available: true,
    rating: 4.3,
    reviews: 98,
    preparationTime: '3-5 mins',
    canteen: 'DMS'
  },
  {
    id: 'dms-4',
    name: 'Cappuccino',
    price: 150,
    description: 'Rich espresso with steamed milk and foam',
    category: 'Beverages',
    available: true,
    rating: 4.7,
    reviews: 234,
    preparationTime: '3-4 mins',
    canteen: 'DMS'
  },
  {
    id: 'dms-5',
    name: 'Chicken Wrap',
    price: 220,
    description: 'Grilled chicken strips with vegetables in a soft tortilla',
    category: 'Wraps',
    available: true,
    rating: 4.4,
    reviews: 156,
    preparationTime: '8-10 mins',
    canteen: 'DMS'
  },
  {
    id: 'dms-6',
    name: 'Fish & Chips',
    price: 350,
    description: 'Crispy fried fish fillet with golden fries',
    category: 'Main Course',
    available: true,
    rating: 4.1,
    reviews: 67,
    preparationTime: '12-15 mins',
    canteen: 'DMS'
  },
  {
    id: 'dms-7',
    name: 'Iced Latte',
    price: 170,
    description: 'Chilled espresso with cold milk and ice',
    category: 'Beverages',
    available: true,
    rating: 4.6,
    reviews: 123,
    preparationTime: '2-3 mins',
    canteen: 'DMS'
  },

  // SFC Items
  {
    id: 'sfc-1',
    name: 'Samosa Chaat',
    price: 120,
    description: 'Crispy samosas topped with yogurt, chutney, and spices',
    category: 'Snacks',
    available: true,
    rating: 4.5,
    reviews: 178,
    isPopular: true,
    preparationTime: '5-7 mins',
    canteen: 'SFC'
  },
  {
    id: 'sfc-2',
    name: 'Chicken Shawarma',
    price: 200,
    description: 'Tender chicken strips with vegetables and garlic sauce in pita bread',
    category: 'Middle Eastern',
    available: true,
    rating: 4.7,
    reviews: 145,
    preparationTime: '8-10 mins',
    canteen: 'SFC'
  },
  {
    id: 'sfc-3',
    name: 'Seekh Kebab',
    price: 180,
    description: 'Grilled minced meat skewers with traditional spices',
    category: 'BBQ',
    available: true,
    rating: 4.4,
    reviews: 92,
    preparationTime: '12-15 mins',
    canteen: 'SFC'
  },
  {
    id: 'sfc-4',
    name: 'Pani Puri',
    price: 100,
    description: 'Crispy shells filled with spiced water and chutneys',
    category: 'Snacks',
    available: true,
    rating: 4.6,
    reviews: 267,
    preparationTime: '3-5 mins',
    canteen: 'SFC'
  },
  {
    id: 'sfc-5',
    name: 'Chicken Karahi',
    price: 290,
    description: 'Traditional chicken curry cooked in a wok with fresh spices',
    category: 'Main Course',
    available: true,
    rating: 4.8,
    reviews: 134,
    preparationTime: '18-22 mins',
    canteen: 'SFC'
  },
  {
    id: 'sfc-6',
    name: 'Lassi',
    price: 90,
    description: 'Traditional yogurt drink - sweet or salty',
    category: 'Beverages',
    available: true,
    rating: 4.3,
    reviews: 89,
    preparationTime: '2-3 mins',
    canteen: 'SFC'
  },
  {
    id: 'sfc-7',
    name: 'Halwa Puri',
    price: 160,
    description: 'Traditional breakfast with semolina pudding and fried bread',
    category: 'Breakfast',
    available: false,
    rating: 4.5,
    reviews: 156,
    preparationTime: '10-12 mins',
    canteen: 'SFC'
  }
];

export const getMenuByCanteen = (canteenId: string): MenuItem[] => {
  return menuItems.filter(item => item.canteen.toLowerCase() === canteenId.toLowerCase());
};

export const getPopularItems = (): MenuItem[] => {
  return menuItems.filter(item => item.isPopular && item.available);
};

export const searchMenuItems = (query: string): MenuItem[] => {
  const searchQuery = query.toLowerCase();
  return menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery) ||
    item.description.toLowerCase().includes(searchQuery) ||
    item.category.toLowerCase().includes(searchQuery)
  );
};