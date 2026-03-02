import { useState, useEffect } from 'react';

export type ContentStatus = "PUBLISHED" | "DRAFT";
export type ContentType = "article" | "video" | "meditation";

export interface ContentItem {
  id: number;
  title: string;
  category: string;
  status: ContentStatus;
  type: ContentType;
  views: string;
  date: string;
  inReview?: boolean;
  seoDescription?: string;
  readTime?: number;
  notifyUsers?: boolean;
  isLocked?: boolean;
}

const initialContent: ContentItem[] = [
  { id: 1, title: "Managing Night Sweats", category: "SYMPTOM RELIEF", status: "PUBLISHED", type: "article", views: "12.4k", date: "Feb 12, 2026", seoDescription: "", readTime: 5, notifyUsers: true, isLocked: false },
  { id: 2, title: "10-Minute Evening Meditation", category: "MENTAL HEALTH", status: "PUBLISHED", type: "meditation", views: "8.2k", date: "Feb 10, 2026", seoDescription: "", readTime: 10, notifyUsers: true, isLocked: false },
  { id: 3, title: "Hormone Replacement Therapy 101", category: "MEDICAL", status: "DRAFT", type: "article", views: "-", date: "", inReview: true, seoDescription: "", readTime: 5, notifyUsers: false, isLocked: true },
  { id: 4, title: "Nutrition for Menopause", category: "WELLNESS", status: "PUBLISHED", type: "article", views: "15.1k", date: "Jan 28, 2026", seoDescription: "", readTime: 8, notifyUsers: true, isLocked: false },
  { id: 5, title: "Strength Training Guide", category: "FITNESS", status: "PUBLISHED", type: "video", views: "5.6k", date: "Feb 01, 2026", seoDescription: "", readTime: 20, notifyUsers: true, isLocked: false },
];

// In-memory store — persists during session (frontend only)
let contentData: ContentItem[] = [...initialContent];
const listeners: (() => void)[] = [];

export const contentStore = {
  getAll: () => contentData,

  getById: (id: number) => contentData.find(item => item.id === id),

  add: (item: Omit<ContentItem, 'id' | 'views' | 'date'>) => {
    const newItem: ContentItem = {
      ...item,
      id: Date.now(),
      views: "-",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    contentData = [...contentData, newItem];
    listeners.forEach(fn => fn());
    return newItem;
  },

  update: (id: number, updates: Partial<ContentItem>) => {
    contentData = contentData.map(item => item.id === id ? { ...item, ...updates } : item);
    listeners.forEach(fn => fn());
  },

  delete: (id: number) => {
    contentData = contentData.filter(item => item.id !== id);
    listeners.forEach(fn => fn());
  },

  subscribe: (fn: () => void) => {
    listeners.push(fn);
    return () => {
      const i = listeners.indexOf(fn);
      if (i > -1) listeners.splice(i, 1);
    };
  },
};

// React hook to use store reactively
export function useContentStore() {
  const [data, setData] = useState<ContentItem[]>(contentStore.getAll());
  useEffect(() => {
    return contentStore.subscribe(() => setData([...contentStore.getAll()]));
  }, []);
  return data;
}