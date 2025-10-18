import { create } from "zustand";
import toast from "react-hot-toast";
import {
  apiGetProductById,
  apiGetProductCategories,
  apiGetProducts,
} from "@/apis/product";

export const useProductStore = create((set, get) => ({
  products: [],
  productsByCategory: {},
  selectedProduct: null,
  isLoading: false,
  bestSellers: [],
  newArrivals: [],
  productCategories: [],

  fetchProducts: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await apiGetProducts(params);
      const { products } = response;
      set({ products: products, isLoading: false });
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch products!"
      );
      set({ isLoading: false });
      return [];
    }
  },
  fetchProductsByCategory: async (category) => {
    const { productsByCategory } = get();

    // Nếu đã có cache thì trả về luôn
    if (productsByCategory[category]) {
      return productsByCategory[category];
    }

    set({ isLoading: true });
    try {
      const response = await apiGetProducts({ category });
      const { products } = response;
      console.log(products);

      // Lưu cache
      set({
        productsByCategory: {
          ...productsByCategory,
          [category]: products,
        },
        isLoading: false,
      });

      return products;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch products!"
      );
      set({ isLoading: false });
      return [];
    }
  },
  fetchBestSellers: async () => {
    set({ isLoading: true });
    try {
      const response = await apiGetProducts({ sort: "-sold" });
      const { products } = response;
      set({ bestSellers: products, isLoading: false });
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch products!"
      );
      set({ isLoading: false });
      return [];
    }
  },
  fetchNewArrivals: async () => {
    set({ isLoading: true });
    try {
      const response = await apiGetProducts({ sort: "-createdAt" });
      const { products } = response;

      set({ newArrivals: products, isLoading: false });
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch products!"
      );
      set({ isLoading: false });
      return [];
    }
  },
  fetchProductsCategory: async () => {
    set({ isLoading: true }); // Bật trạng thái loading
    try {
      const response = await apiGetProductCategories();

      const { result } = response;
      set({ productCategories: result, isLoading: false });

      return result;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch products!"
      );
      set({ isLoading: false });
      return [];
    }
  },
  fetchProductById: async (productId) => {
    set({ isLoading: true });
    try {
      const response = await apiGetProductById(productId);

      const { product } = response;
      set({ selectedProduct: product, isLoading: false });

      return product;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch product!");
      set({ isLoading: false });
      return null;
    }
  },

  // createProduct: async (productData) => {
  //   set({ isLoading: true });
  //   try {
  //     const response = await axiosInstance.post("/products", productData, {
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     const { data } = response.data;

  //     set((state) => ({
  //       products: [...state.products, data],
  //       isLoading: false,
  //     }));

  //     toast.success("Product created successfully!");
  //     return data;
  //   } catch (error) {
  //     console.error("Error creating product:", error);
  //     toast.error(
  //       error?.response?.data?.message || "Failed to create product!"
  //     );
  //     set({ isLoading: false });
  //     return false;
  //   }
  // },

  // updateProduct: async (productId, productData) => {
  //   set({ isLoading: true });
  //   try {
  //     const response = await axiosInstance.put(
  //       `/products/${productId}`,
  //       productData,
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     const { data } = response.data;

  //     set((state) => ({
  //       products: state.products.map((p) =>
  //         p._id === productId ? { ...p, ...data } : p
  //       ),
  //       selectedProduct:
  //         state.selectedProduct?._id === productId
  //           ? { ...state.selectedProduct, ...data }
  //           : state.selectedProduct,
  //       isLoading: false,
  //     }));

  //     toast.success("Product updated successfully!");
  //     return true;
  //   } catch (error) {
  //     toast.error(
  //       error?.response?.data?.message || "Failed to update product!"
  //     );
  //     set({ isLoading: false });
  //     return false;
  //   }
  // },

  // deleteProduct: async (productId) => {
  //   set({ isLoading: true });
  //   try {
  //     await axiosInstance.delete(`/products/${productId}`);

  //     set((state) => ({
  //       products: state.products.filter((p) => p._id !== productId),
  //       isLoading: false,
  //     }));

  //     toast.success("Product deleted successfully!");
  //     return true;
  //   } catch (error) {
  //     console.error("Error deleting product:", error);
  //     toast.error(
  //       error?.response?.data?.message || "Failed to delete product!"
  //     );
  //     set({ isLoading: false });
  //     return false;
  //   }
  // },

  // // ✅ Reset toàn bộ state product
  // resetProducts: () => set({ products: [], selectedProduct: null }),
}));
