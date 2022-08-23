import useLocale from './useLocale';
import useShippingMethods from './ct/useShippingMethods';
import {getValue} from "@/lib";
import useCart from "hooks/useCart";

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
