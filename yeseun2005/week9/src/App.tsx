import { useEffect } from "react";
import CartContainer from "./components/CartContainer";
import { useCartStore } from "./store/useCartStore";

function App() {
  const { cartItems, calculateTotals } = useCartStore();

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  return <CartContainer />;
}

export default App;