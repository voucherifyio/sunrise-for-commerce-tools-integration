import { useCartActions } from 'hooks/useCartMutation';
import config from '../sunrise.config';
import useCart from './useCart';
import { AVAILABLE_CODES_NAMES } from '../src/constants'

function subTotal(cartLike) {
  const { currencyCode, fractionDigits } =
    cartLike.totalPrice;
  const priceCentAmount = cartLike.lineItems.reduce(
    (acc, li) =>
      acc + li.quantity * li.price.value.centAmount,
    0
  );
  const totalPriceCentAmount = cartLike.lineItems.reduce(
      (acc, li) => {
        if(li.price.discounted) {
          return acc + li.quantity * li.price.discounted.value.centAmount
        }else{
          return acc + li.quantity * li.price.value.centAmount
        }
      }, 0
  );
  const discounted =
    priceCentAmount === totalPriceCentAmount
      ? {}
      : {
          discounted: {
            value: {
              centAmount: totalPriceCentAmount,
              currencyCode,
              fractionDigits,
            },
          },
        };
  return {
    value: {
      centAmount: priceCentAmount,
      currencyCode,
      fractionDigits,
    },
    ...discounted,
  };
}
const cartNotEmpty = (cart) =>
  Boolean(cart && Boolean(cart?.lineItems?.length));

const total = (lineItem) => {
  if (lineItem.price.discounted) {
    return {
      value: {
        ...lineItem.price.value,
        centAmount:
          lineItem.price.value.centAmount *
          lineItem.quantity,
      },
      discounted: {
        value: {
          ...lineItem.price.discounted.value,
          centAmount:
              lineItem.price.discounted.value.centAmount *
              lineItem.quantity,
        },
      },
    };
  }
  return { value: lineItem.totalPrice };
};
const lineItemAttr = (lineItem) => {
  const attributes = lineItem.variant.attributesRaw
    .filter(({ name }) =>
      config.variantInProductName.includes(name)
    )
    .map(({ attributeDefinition, value }) => [
      attributeDefinition.label,
      value,
    ]);
  return attributes.join(', ');
};

const productRoute = (lineItem) => {
  return {
    name: 'product',
    params: {
      sku: lineItem.variant.sku,
      productSlug: lineItem.productSlug,
    },
  };
};
const displayedImageUrl = (variant) => {
  return variant?.images?.[0].url;
};
const taxes = (cart) => {
  const { taxedPrice } = cart;
  if (taxedPrice) {
    return {
      value: {
        centAmount:
          taxedPrice.totalGross.centAmount -
          taxedPrice.totalNet.centAmount,
        currencyCode: taxedPrice.totalGross.currencyCode,
        fractionDigits:
          taxedPrice.totalGross.fractionDigits,
      },
    };
  }
  return null;
};
const discountCodesExist = (cart) => {
  return Boolean(cart.discountCodes?.length);
};
const discountVoucherifyCodesExist = (cart) => {
  let codeExist = false;
  cart.custom?.customFieldsRaw?.forEach(element => {
    if(element.name === AVAILABLE_CODES_NAMES.DISCOUNT_CODES && element.value.length != 0) codeExist = true;
  });
  return codeExist
};

const returnVoucherifyCodes = (cart) => {
  let voucherifyCodes = [];
  cart.custom?.customFieldsRaw?.forEach(element => {
    if(element.name === AVAILABLE_CODES_NAMES.DISCOUNT_CODES && element.value.length != 0) voucherifyCodes = element.value;
  });
  return voucherifyCodes;
}

function useCartTools() {
  const cartActions = useCartActions();
  const cartTools = {
    ...cartActions,
    cartNotEmpty,
    total,
    lineItemAttr,
    productRoute,
    displayedImageUrl,
    subTotal,
    taxes,
    discountCodesExist,
    discountVoucherifyCodesExist,
    returnVoucherifyCodes,
    useCart,
  };
  return cartTools;
}
export default useCartTools;
