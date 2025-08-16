import { auth, db } from './firebase';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';

/**
 * Client-owned document creation helpers
 * These create documents that the client is allowed to write by security rules
 */

// Create a new reel document
export async function createReel(reelData: {
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  musicId?: string;
  duration: number;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be authenticated to create reel');

  const reelRef = doc(collection(db, 'reels'));
  await setDoc(reelRef, {
    ...reelData,
    ownerId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    stats: {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0
    },
    published: true
  });

  return reelRef.id;
}

// Create a new product document
export async function createProduct(productData: {
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  tags: string[];
}) {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be authenticated to create product');

  const productRef = doc(collection(db, 'products'));
  await setDoc(productRef, {
    ...productData,
    ownerId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    active: true,
    inventory: {
      available: true,
      quantity: 1
    }
  });

  return productRef.id;
}

// Create a new order document
export async function createOrder(orderData: {
  productId: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  shippingAddress: any;
  paymentMethod: string;
}) {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be authenticated to create order');

  const orderRef = doc(collection(db, 'orders'));
  await setDoc(orderRef, {
    ...orderData,
    userId: user.uid,
    createdAt: serverTimestamp(),
    status: 'pending',
    paymentStatus: 'pending'
  });

  return orderRef.id;
}

// Helper to get current user's reels
export async function getUserReels() {
  const user = auth.currentUser;
  if (!user) return [];

  // This would typically use a query like:
  // const q = query(collection(db, 'reels'), where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'));
  // const snapshot = await getDocs(q);
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // For now, return empty array - will be populated when user creates content
  return [];
}

// Helper to get current user's products
export async function getUserProducts() {
  const user = auth.currentUser;
  if (!user) return [];

  // This would typically use a query like:
  // const q = query(collection(db, 'products'), where('ownerId', '==', user.uid), where('active', '==', true));
  // const snapshot = await getDocs(q);
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // For now, return empty array - will be populated when user creates products
  return [];
}

// Helper to get current user's orders
export async function getUserOrders() {
  const user = auth.currentUser;
  if (!user) return [];

  // This would typically use a query like:
  // const q = query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
  // const snapshot = await getDocs(q);
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // For now, return empty array - will be populated when user makes orders
  return [];
}
