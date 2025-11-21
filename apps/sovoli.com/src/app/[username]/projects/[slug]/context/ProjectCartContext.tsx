"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  type: "material" | "labor";
  quantity: number; // Selected quantity
  unit: string;
  unitPrice: number;
  totalCost: number; // quantity * unitPrice
}

interface ProjectCartContextType {
  items: Record<string, CartItem>;
  setItemQuantity: (
    item: Omit<CartItem, "totalCost">,
    quantity: number,
  ) => void;
  getItemQuantity: (id: string) => number;
  totalItems: number;
  totalCost: number;
  itemCount: number; // Distinct items count
}

const ProjectCartContext = createContext<ProjectCartContextType | undefined>(
  undefined,
);

export function ProjectCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<string, CartItem>>({});

  const setItemQuantity = (
    item: Omit<CartItem, "totalCost">,
    quantity: number,
  ) => {
    setItems((prev) => {
      if (quantity <= 0) {
        const next = { ...prev };
        delete next[item.id];
        return next;
      }

      return {
        ...prev,
        [item.id]: {
          ...item,
          quantity,
          totalCost: quantity * item.unitPrice,
        },
      };
    });
  };

  const getItemQuantity = (id: string) => {
    return items[id]?.quantity ?? 0;
  };

  const totalItems = Object.values(items).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const itemCount = Object.keys(items).length;

  const totalCost = Object.values(items).reduce(
    (sum, item) => sum + item.totalCost,
    0,
  );

  return (
    <ProjectCartContext.Provider
      value={{
        items,
        setItemQuantity,
        getItemQuantity,
        totalItems,
        totalCost,
        itemCount,
      }}
    >
      {children}
    </ProjectCartContext.Provider>
  );
}

export function useProjectCart() {
  const context = useContext(ProjectCartContext);
  if (!context) {
    throw new Error("useProjectCart must be used within a ProjectCartProvider");
  }
  return context;
}
