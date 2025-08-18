import { useCallback } from 'react';

export function useProductManagement(products, setProducts) {
  const handleAddProduct = useCallback(() => {
    setProducts((prev) => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map((p) => p.id)) + 1 : 1,
        name: "",
        quantity: 1,
        productId: null,
        image: null,
        productHandle: null
      }  
    ]);
  }, [setProducts]);

  const handleRemoveProduct = useCallback((productId) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  }, [setProducts]);

  const handleProductNameChange = useCallback(
    (index, value) => {
      setProducts((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], name: value };
        return updated;
      });
    },
    [setProducts]
  );

  const handleProductQuantityChange = useCallback(
    (index, value) => {
      setProducts((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], quantity: parseInt(value) || 1 };
        return updated;
      });
    },
    [setProducts]
  );

  return {
    handleAddProduct,
    handleRemoveProduct,
    handleProductNameChange,
    handleProductQuantityChange
  };
}