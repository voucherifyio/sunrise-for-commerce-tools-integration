import useLocale from './useLocale';
import useShippingMethods from './ct/useShippingMethods';
import useCart from "hooks/useCart";
import {getValue} from "@/lib";

export default () => {
  const { locale } = useLocale();
  const { cart } = useCart();
  const cartId = getValue(cart).cartId;
  const { total, shippingMethods, loading, error } =
    useShippingMethods({
      cartId,
      locale
    });
  return {
    total,
    shippingMethods,
    loading,
    error,
  };
};
