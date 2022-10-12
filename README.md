# sunrise-for-commerce-tools-integration

[![Licence](https://img.shields.io/hexpm/l/plug)](https://www.apache.org/licenses/LICENSE-2.0)
[![version](https://img.shields.io/github/package-json/v/voucherifyio/sunrise-for-commerce-tools-integration)]()
[![code size](https://img.shields.io/github/languages/code-size/voucherifyio/sunrise-for-commerce-tools-integration)]()

This repository is a fork from [Sunrise SPA](https://github.com/commercetools/sunrise-spa) which extends it by features that allows you use codes provided by [Voucherify application](https://www.voucherify.io) via [Commerce Tools integration](https://github.com/voucherifyio/commerce-tools-integration).

![https://www.voucherify.io/?utm_source=github&utm_medium=repo&utm_campaign=opensource](./public/voucherify.png)

## Table of Contents

1. [Related applications](#related-applications)
2. [Prerequisites](#prerequisites)
3. [Dependencies](#Dependencies)
4. [Installation](#Installation)
5. [High level integration requirements](#high-level-integration-requirements)
   1. [Cover the following use cases](#cover-the-following-use-cases)
   2. [Graphql request changes](#graphql-request-changes)
   3. [Request example](#request-example)
   4. [Result example](#result-example)
6. [Changes in our sunrise fork](#changes-in-our-sunrise-fork)
   1. [CartLikePriceDetail](#cartlikepricedetail)
   2. [CartLikePriceDetail/DiscountCodes](#cartlikepricedetaildiscountcodes)
   3. [CartLikePriceDetail/DiscountCodes/RemoveDiscountCodeForm](#cartlikepricedetaildiscountcodesremovediscountcodeform)
   4. [AddDiscountCodeForm](#adddiscountcodeform)
   5. [CartLikeContentDetail/LimeItemInfo](#cartlikecontentdetaillimeiteminfo)
   6. [Other changes](#other-changes)
7. [Contributing](#contributing)
8. [Changelog](#changelog)
9. [Contact](#contact)
10. [Licence](#licence)

## Related applications

- Voucherify https://www.voucherify.io
- Sunrise SPA https://github.com/commercetools/sunrise-spa
- Commerce Tools https://commercetools.com/?location=emea
- Commerce Tools Integration https://github.com/voucherifyio/commerce-tools-integration

## Prerequisites

Before you begin, ensure you have the following requirements

- Voucherify account and valid API keys
- Commerce Tools account with created API Client and valid API keys
- Hosted Commerce Tools Integration 

## Dependencies

- Node.js >= 16.15.0
- npm >= 8.5.5

## Installation

To install follow these steps:

Windows, Linux and macOS:
>* Clone repository
>* run command `npm install`
>* add `.env` file generated in Commerce Tools during creation of new API Client (select `Sunrise SPA` option)
>* run command `npm run dev` for development environment or `npm run build` for production 
>
> consider importing test data into the Commerce Tools https://docs.commercetools.com/sdk/sunrise-data

**.env** example file
```env
VUE_APP_CT_PROJECT_KEY=
VUE_APP_CT_CLIENT_ID=
VUE_APP_CT_CLIENT_SECRET=
VUE_APP_CT_SCOPE=
VUE_APP_CT_AUTH_HOST=
VUE_APP_CT_API_HOST=
```

## High level integration requirements

### Cover the following use cases

To flawless work of your frontend application you need to cover a few use case
- appliging single discount code to your cart
- listing single or multiple discount codes applied (we provide support for single and multiple code as well) 
- removing codes from your cart
- handle removing products of changing of their quantity (applied codes needs to be revalidated, some codes may be not able to apply after changes)
- handle coupons that add new products to your cart

In our example, each action related to codes (adding, removing) and changing products in the cart (adding, removing, changing quantity) mutate the state of the cart. Next, by Graphql query to Commerce Tools API, we get data with codes validation results shown in cart view.

### Graphql request changes

Basic Graphql quary need to be extended due to recieving additional customFields where data about V% codes are stored.

### Request example

#### Adding codes 

When you want to add new code by your AddDiscountCodeFrom you need to pass all used codes so far and new one 

```js
// Each array element need to be stringified by JSON.stringify()
const codes = [
  {
      "code": "UNIT_TYPE_CODE",
      "status": "APPLIED"
  }
  {
      "code": "50%OFF",
      "status": "NEW"
  }
]
```

Then you need to pass it to your Graphql query through a custom field named "discount_codes", more here: https://docs.commercetools.com/api/projects/custom-fields#customfields

```js
{
  setCustomField: {
    name: "discount_codes",
    value: JSON.stringify(codes.map(code => JSON.stringify(code)))
  },
}
```

#### Fetching cart data

```js
query myCart($locale: Locale!) {
  myCart: me {
    activeCart {
      (...)
      lineItems {
        (...)
        custom {
          customFieldsRaw {
            name
            value
          }
        }
      }
      (...)
      custom {
        customFieldsRaw {
            name
            value
        }
      }
      customLineItems {
        name(locale: $locale)
        totalPrice {
            centAmount
            currencyCode
            fractionDigits
        }
        slug
      }
    }
  }
}
```

### Result example

```js
{
  activeCart {
    (...)
    lineItems {
      (...)
      custom {
        customFieldsRaw {
          "name": "applied_codes",
          // Each value element needs to be parsed from stringified json to object 
          // "{\"code\":\"UNIT_TYPE_CODE\",\"type\":\"UNIT\",\"effect\":\"ADD_MISSING_ITEMS\",\"quantity\":1,\"totalDiscountQuantity\":1}"
          "value": [
            {
              code: "UNIT_TYPE_CODE",
              type: "UNIT",
              effect: "ADD_MISSING_ITEMS",
              quantity: 1,
              totalDiscountQuantity: 1,
            }
          ]
        }
      }
    }
    (...)
    custom: {
      customFieldsRaw: {
        name: "discount_codes",
        // Each value element needs to be parsed from stringified json to object
        // "{\"code\":\"UNIT_TYPE_CODE\",\"status\":\"APPLIED\",\"value\":17900}"
        value: [
          {
              code: "UNIT_TYPE_CODE",
              status: "APPLIED",
              value: 17900
          }
        ]
      }
    }

    customLineItems: {
      "name": "Voucher, coupon value => 181.50",
      "totalPrice": {
          "centAmount": -18150,
          "currencyCode": "EUR",
          "fractionDigits": 2
      }
    }
  }
}
```

> **activeCart.lineItems.custom.customFieldsRaw** is commerce tools custom field that store data about codes applied for your products. Currently we handle "unit type" codes.
> **activeCart.custom.customFieldsRaw** store information about each codes which was applied for Your cart.
> **activeCart.customLineItems** there are information about your summary Voucher and currency detail


## Changes in our sunrise fork

In purpose to use our commercetools example application Sunrise SPA https://github.com/commercetools/sunrise-spa with Voucherify integration
you need to make some changes in code. You can simply use our Sunrise fork with following changes

**CartDetail.vue** is our main component related to cart. There is only single change - passing cart object to **AddDiscountCodeForm** component This component contains there main children where chagnes was realized. 
- CartLikePriceDetail,
- AddDiscountCodeForm,
- CartLikeContentDetail

```vue
<AddDiscountCodeForm :cart="cart" />
```

### CartLikePriceDetail

In **CartLikePriceDetail.vue** DiscountCodes component was made dependent on discountVoucherifyCodesExist and template about discount was a bit changed

```vue
<div>
   <Promotions v-if="!couponsLimitExceeded"
               :cart="cart"
               :editable="editable"
   />
   <div v-else>
           <span class="voucher-error">
             {{t('couponsLimitExceeded')}} {{couponsLimit}}
           </span>
   </div>
   (...)
   <DiscountCodes
     v-if="discountVoucherifyCodesExist(cart)"
     :cart="cart"
     :editable="editable"
   />
</div>

<div v-if="isValidationFailed" class="voucher-error">
   <b>
      {{ t('validationError') }}
   </b>
</div>

<div class="cart-total-wrap">
  <div class="row" v-if="discountValue.centAmount != 0">
    <div class="single-cart-total-left col-sm-6">
      <b>{{ t('discount') }}</b>
    </div>
    <div
      class="single-cart-total-right col-sm-6"
      data-test="cart-total-price"
    >
      <b>
        <BasePrice :price="{ value: discountValue }" />
      </b>
    </div>
  </div>
  <div class="row">
    <div class="single-cart-total-left col-sm-6">
      <b>{{ t('total') }}</b>
    </div>
    <div
      class="single-cart-total-right col-sm-6"
      data-test="cart-total-price"
    >
      <b>
        <BasePrice :price="{ value: cart.totalPrice }" />
      </b>
    </div>
  </div>
</div>
```

**CartLikePriceDetail.js** was extended by logic that allows to filter and get data about the current applied voucher

```js
import {CUSTOM_LINE_ITEM_VOUCHER_SLUG} from '../../../../constants'
import useCouponsLimitExceeded from "hooks/useCouponsLimitExceeded";

export default {
  (...)
  computed: {
    discountValue(props) {
      const customLineItemWithDiscount = props.cart.customLineItems.find(item => item.slug.startsWith(CUSTOM_LINE_ITEM_VOUCHER_SLUG))
      if(customLineItemWithDiscount) {
        return customLineItemWithDiscount.totalPrice
      }
      return 0
    },
     
    isValidationFailed(props){
      const isValidationFailed = props.cart.custom.customFieldsRaw.find(field => field.name === 'isValidationFailed')
      
      return isValidationFailed?.value ?? false;
    },

    couponsLimitExceeded(props){
       return useCouponsLimitExceeded(props);
    },
   
    couponsLimit(props){
       const couponLimit = props.cart.custom.customFieldsRaw.find(field => field.name === 'couponsLimit')
   
       return couponLimit?.value ?? 5;
    }
  }
};
```

In **styles.css** and **CartLikePriceDetail.txt** styles and translates were added.

### CartLikePriceDetail/DiscountCodes

> **DiscountCodes.js** was extended by computed property which map V% codes and component **BasePrice**
```js
import { AVAILABLE_CODES_NAMES, CODES_STATUSES } from "../../../../../constants";
import DiscountCode from "presentation/components/DiscountCode/DiscountCode.vue";
import useAppliedCodes from "hooks/useAppliedCodes";

export default {
  components: { RemoveDiscountCodeForm, BasePrice, DiscountCode },
  (...)
  computed: {
    appliedCodes() {
        const appliedCodes = useAppliedCodes(this);

        return appliedCodes.length ? appliedCodes : false
    }
  },
  (...)
}
```

**DiscountCodes.vue** template was changed a bit, added usage of **BasePrice** component and maping for appliedCodes from computed property

```vue
<template>
  <div class="single-grand-total" v-if="appliedCodes">
    <div class="single-grand-total-left col-sm-6">
      <span>{{ t('appliedDiscounts') }}</span>
    </div>
    <div
      class="single-grand-total-right col-sm-6"
      data-test="discount-code-name"
    >
       <div v-for="code in appliedCodes" :key="code">
          <discount-code :code="code" :cart="cart" :editable="editable"></discount-code>
       </div>
    </div>
  </div>
</template>
```

**DiscountCode.vue**, **DiscountCode.js** and **DiscountCode.css** was added. This component show single code element

```vue
<style src="./DiscountCode.css" scoped></style>
<script src="./DiscountCode.js"></script>

<template>
  <div class="code-container">
    <b>{{code.code}}</b>
    <b class="code-gap"></b>
    <b class="code-value">
      <BasePrice :price="{value: {centAmount: typeof code.value == 'number' ? -code.value : code.value, fractionDigits: cart.totalPrice.fractionDigits, currencyCode: cart.totalPrice.currencyCode}}" />
    </b>
    <RemoveDiscountCodeForm
        v-if="editable"
        :cart="cart"
        :code="code.code"
    />
  </div>
</template>
```

**BaseMoney.js** was changed to form that allow to show string type elements on discount list.

```js
(...)

export default {
   const { n } = useI18n();
   (...)
   setup(props) {
    (...)
    const formattedMoney = computed(() => {
      if (typeof props?.money?.centAmount == "number"){
        return n(amount.value, 'currency', location.value);
      } else {
        return props?.money?.centAmount ?? '';
      }
    });
    (...)
  },
};
```

In **DiscountCodes/style.css** style was added

```css
.code-container {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
}
.code-gap {
  flex-grow: 1;
}
.code-value {
  color: rgb(0,222,0);
}
```

### CartLikePriceDetail/DiscountCodes/RemoveDiscountCodeForm

**RemoveDiscountCodeForm.js** extended logic allowed to remove codes with on click method binded in **RemoveDiscountCodeForm.vue**

```js 
  setup(props) {
    const {
      returnVoucherifyCodes,
      applyVoucherifyDiscount,
    } = useCartTools();

    const removeDiscount = () => {
      const codes = returnVoucherifyCodes(props.cart)
        .map(code => JSON.parse(code))
        .map(code => {
          if(code.code === props.code) {
            return {
              code: code.code,
              value: code.value,
              status: CODES_STATUSES.DELETED
            }
          }
          return code
        })
        
      applyVoucherifyDiscount(codes)
    };
    return { removeDiscount };
  },
```

### AddDiscountCodeForm

In **AddDiscountCodeForm.vue** component ServeError was replaced from

```vue
<ServerError
  :error="error"
  v-slot="{ graphQLError }"
  class="server-error"
  >{{ getErrorMessage(graphQLError) }}
</ServerError>
```
> to
```vue
<p class="message" :class="{ 'voucher-error': !codesInfo.status }">
  {{codesInfo.message}}
</p>
```

Property
```vue
:disabled="couponsLimitExceeded"
```
Was added to BaseInput and Input elements.

In **AddDiscountCodeForm.js** there are new logic for adding V% codes in applyDiscount() and watch that handle errors in added codes.

```js
(...)
import { ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';
import { CODES_STATUSES } from '../../../../constants';
import useCouponsLimitExceeded from "hooks/useCouponsLimitExceeded";

export default {
  components: {
    BaseForm,
    BaseInput,
    ServerError,
  },
  props: {
    cart: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const codesInfo = ref({})
    const enteredCode = ref('')
    const { t } = useI18n();
    const {
      applyVoucherifyDiscount,
      returnVoucherifyCodes,
    } = useCartTools();

    const form = ref({});

    const v = useVuelidate({
      code: {}
    }, form)

    const applyDiscount = () => {
      enteredCode.value = form.value.code;

      const codes = returnVoucherifyCodes(props.cart)
          .map(code => JSON.parse(code))
          .filter(code => Object.values(CODES_STATUSES).includes(code.status));

      form.value.code = ''

      if(enteredCode.value){
        return applyVoucherifyDiscount([...codes, { code: enteredCode.value, status: CODES_STATUSES.NEW }])
      }else{
        return applyVoucherifyDiscount([...codes])
      }
    };
    
    applyDiscount();

    const getErrorMessage = ({ code }) => {
      if (code === 'DiscountCodeNonApplicable') {
        return t('nonApplicable');
      }
      return t('unknownError');
    };

    watch(props, props => {
      const codes = returnVoucherifyCodes(props.cart).map(code => JSON.parse(code))
      const lastAppliedCode = codes.find(code => code.code === enteredCode.value)
      if(lastAppliedCode) {
        codesInfo.value = {
          message: lastAppliedCode ? `${lastAppliedCode.status !== CODES_STATUSES.APPLIED && lastAppliedCode.errMsg ? lastAppliedCode.errMsg : lastAppliedCode.status}` : '',
          status: lastAppliedCode.status === CODES_STATUSES.APPLIED ? true : false,
        }
      }
    })

    return {
      t,
      applyDiscount,
      form,
      codesInfo,
      getErrorMessage,
      v,
    };
  },
   
  computed: {
     couponsLimitExceeded(props) {
        return useCouponsLimitExceeded(props);
     }
  }
};
```

### CartLikeContentDetail/LimeItemInfo

Here was shown a discount for single product and changing in showing BasePrice. This change is related to fixed price promotions for line items.

**LimeItemInfo.vue**

```vue
<td class="product-name">
  (...)
  <b class="discounted-quantity" v-if="quantityFromCode">
    {{ t('discounted') }} : {{quantityFromCode}}
  </b>
</td>
<td v-if="!selectable" class="product-price">
   <span class="amount" data-test="item-price">
      <BasePrice :price="getPrice(lineItem)"/>
   </span>
</td>
(...)
<td v-if="!selectable"
    class="product-total"
    data-test="line-total"
>
   <span>
      <BasePrice :price="total(getTotalPrice(lineItem))" />
   </span>
</td>
```

In **LimeItemInfo.js** was added computed function **quantityFromCode** that return unit type codes applied to products 

```js
import { AVAILABLE_CODES_NAMES, CODES_TYPES } from '../../../../../constants'
import { useI18n } from 'vue-i18n';
import {getPrice, getTotalPrice} from "hooks/useFixedPrice";

export default {
    (...)
    setup(props, { emit }) {
    (...)
    const { t } = useI18n();
   
    return {
      t,
      selected,
      item,
      ...useCartTools(),
      getPrice,
      getTotalPrice
    };
   }
   
   computed: {
    quantityFromCode(props){
      const codeWithFreeItem = props.lineItem.custom?.customFieldsRaw
          .find(code => code.name === AVAILABLE_CODES_NAMES.APPLIED_CODES)
          
      if(codeWithFreeItem) {
          return codeWithFreeItem
          .value
          .map(code => JSON.parse(code))
          .find(code => code.type === CODES_TYPES.UNIT)
          .totalDiscountQuantity
      }
   
      return 0
    }
   }
}
```

In **LimeItemInfo.txt** new translate was added

```txt
en:
  available: "Available"
  discounted: "Discounted"
de:
  available: "Verfügbar"
  discounted: "Ermäßigt"
```

In **style.css** added new styles
```css
.new-price > span{
  color: rgb(0,222,0) !important;
}
```

### Promotions

To handle [Promotion Tiers](https://docs.voucherify.io/docs/promotion-tier) we add `Promotion` component (`src/presentation/fashion/CartDetail/CartLikePriceDetail/Promotions`). It works the way that we look for discounts in created promotion tiers in the Voucherify project, which are available for specific carts (it is done by the backend) and then we list them on the frontend, where users can add and remove them from the cart, which works similar to the way how we add typical coupons.

This component is placed in the `CartLikePriceDetail.vue` component. Additionally, to make it work properly we add the `AVAILABLE` code status to `CODES_STATUSES` const and in `src/presentation/fashion/CartDetail/CartLikePriceDetail/DiscountCodes/RemoveDiscountCodeForm/RemoveDiscountCodeForm.js` we add a new returned field which is called `type` (coupons and promotions tiers are handled a little bit different in Voucherify so we have to differentiate them to use the same component for removing discounts). Moreover, there are some typical CSS/HTML changes to look it better. 

### OrderOverview

On the order overview there are a few changes that allows to display fixed prices and codes summary.

In **OrderOverview.js** added computed fields `discountValue` and `appliedCodes` and functions `getSubTotal`, 
`getPrice` were reported. 

```js
(...)
import DiscountCode from "presentation/components/DiscountCode/DiscountCode.vue";
import {getSubTotal, getPrice} from "hooks/useFixedPrice";

export default {
   components: {
      ShippingMethod,
      BasePrice,
      PaymentMethod,
      DiscountCode,
      // VuePerfectScrollbar,
   },
   (...)
   setup(props, { emit }) {
      (...)
      return {
         (...)
         getSubTotal,
         getPrice
      };
   }

   computed: {
      discountValue(props) {
         const customLineItemWithDiscount = props.cart.customLineItems.find(item => item.slug.startsWith(CUSTOM_LINE_ITEM_VOUCHER_SLUG))
         if(customLineItemWithDiscount) {
            return customLineItemWithDiscount.totalPrice
         }
         return 0
      },
   
      appliedCodes() {
         const appliedCodes = this.cart.custom?.customFieldsRaw
                 .filter(field => field.name === AVAILABLE_CODES_NAMES.DISCOUNT_CODES)
                 .reduce(customField => customField)
                 .value
                 .map(code => JSON.parse(code))
                 .filter(code => code.status === CODES_STATUSES.APPLIED)
   
         return appliedCodes.length ? appliedCodes : false
      }
   }
},
```

Template **OrderOverview.vue** was extended by showing discounts and fixed prices.

```vue
(...)
<BasePrice :price="getPrice(lineItem)"></BasePrice>
(...)
<BasePrice :price="subTotal(getSubTotal(cart))"></BasePrice>
(...)
<div v-if="appliedCodes || appliedCodes">
   <div class="mt-10"></div>
   <div class="your-order-info">
      <ul>
         <li class="bold-text">
            {{ t('code') }}
            <span>{{ t('discount') }}</span>
         </li>
      </ul>
   </div>
   <div class="your-order-info order-subtotal">
      <div v-for="code in appliedCodes" :key="code">
         <discount-code :code="code" :cart="cart" :editable="false"></discount-code>
      </div>
   </div>
   <div class="your-order-info order-subtotal">
      <ul>
         <li>
            <b class="bold-text">{{ t('allDiscount') }}</b>
            <span class="code-value">
                    <b>
                      <BasePrice :price="{ value: discountValue }" />
                    </b>
                  </span>
         </li>
      </ul>
   </div>
</div>
```

There also was added styles and translates in **OrderOverview.scss** and **OrderOverview.txt**.

### Other changes

#### UseCartMutation

Functions that extends **useCartMutation.js** allowed to mark changes in codes used in cart and revalidate codes.

```js
const applyVoucherifyDiscount = (code) =>
    mutateCart(addVoucherifyDiscountCode(code)); 
```

Functions in **composition/ct/useCartMutation.js** which are handlers for changes in codes

```js
import { AVAILABLE_CODES_NAMES } from '../../src/constants'
(...)
export const addVoucherifyDiscountCode = (codes) => [
  {
    setCustomField: {
      name: AVAILABLE_CODES_NAMES,
      value: JSON.stringify( codes.map(code => JSON.stringify(code)))
    },
  },
];
export const removeVoucherifyCode = () => [
  {
    setCustomField: {
      name: AVAILABLE_CODES_NAMES,
    },
  },
];
```

Functions in **composition/useCartTools.js** for checking if V% discount codes exist and for returning it. And changing in `total` 
function that allow to calculate total value including fixed price amount if applied. 

```js
import { AVAILABLE_CODES_NAMES } from '../src/constants'
(...)
function subTotal(cartLike) {
   (...)
   const totalPriceCentAmount = cartLike.lineItems.reduce(
           (acc, li) => {
              if(li.price.discounted) {
                 return acc + li.quantity * li.price.discounted.value.centAmount
              }else{
                 return acc + li.quantity * li.price.value.centAmount
              }
           }, 0
   );
   (...)
}
(...)
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
(...)
const discountVoucherifyCodesExist = (cart) => {
  let codeExist = false;
  cart.custom.customFieldsRaw.forEach(element => {
    if(element.name === AVAILABLE_CODES_NAMES.DISCOUNT_CODES && element.value.length != 0) codeExist = true;
  });
  return codeExist
};

const returnVoucherifyCodes = (cart) => {
  let voucherifyCodes = [];
  cart.custom.customFieldsRaw.forEach(element => {
    if(element.name === AVAILABLE_CODES_NAMES.DISCOUNT_CODES && element.value.length != 0) voucherifyCodes = element.value;
  });
  return voucherifyCodes;
}
(...)
```

#### UseFixedPrice

File **useFixedPrice.js** was added. Those functions are designed for handling fixed prices from coupons.

```js
export function getCouponFixedPrice(custom){
    if(custom?.customFieldsRaw?.length > 0){
        return custom?.customFieldsRaw.filter((element) => {
            return element.name === 'coupon_fixed_price';
        }).map((element) => element.value)[0];
    } else {
        return null
    }
}

export function getPrice(lineItem){
    const price = {
        ...lineItem.price
    }
    const couponFixedPrice = getCouponFixedPrice(lineItem.custom);
    if(couponFixedPrice){
        price.discounted = {
            value: {
                currencyCode: lineItem.price.value.currencyCode,
                fractionDigits: lineItem.price.value.fractionDigits,
            }
        }
        price.discounted.value.centAmount = couponFixedPrice;
    }

    return price;
}

export function getTotalPrice(lineItem){
    return {
        ...lineItem,
        price: getPrice(lineItem)
    };
}

export function getSubTotal(cart){
    return {
        ...cart,
        lineItems: cart.lineItems.map((lineItem) => getTotalPrice(lineItem))
    }
}
```

#### UseShippingMethods

Changes in **./composition/ct/useShippingMethods.js** for proper getting shipping's methods relied on current cart state. 

```js
(...)
const query = gql`
  query shippingMethods(
    $cartId: String!
    $locale: Locale!
  ) {
    shippingMethodsByCart(
      id: $cartId
    ) {
      (...)
    }
  }
`;

const useShippingMethods = ({
   (...)
   const { loading, error } = useQueryFacade(query, {
      (...)
      onCompleted: (data) => {
         if (!data) {
            return;
         }
         setShippingMethods(data.shippingMethodsByCart);
      },
      fetchPolicy: 'network-only'
   });
   return { shippingMethods, loading, error };
};
export default useShippingMethods;
```

In **./composition/useShippingMethods.js** there are changes for proper passing parameters to method.

```js
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

```

**/composition/useAppliedCodes.js** is used for getting applied codes from cart custom fields.

```js
import {AVAILABLE_CODES_NAMES, CODES_STATUSES} from "@/constants";

export default function useAppliedCodes(props) {
    return props.cart.custom?.customFieldsRaw
        .filter(field => field.name === AVAILABLE_CODES_NAMES.DISCOUNT_CODES)
        .reduce(customField => customField)
        .value
        .map(code => JSON.parse(code))
        .filter(code => code.status === CODES_STATUSES.APPLIED)
}
```


**/composition/useCouponsLimitExceeded.js** is used for checking is current applied codes exceed coupons limit. 

```js
import useAppliedCodes from "hooks/useAppliedCodes";

export default function useCouponsLimitExceeded(props) {
    const couponLimit = props.cart.custom.customFieldsRaw.find(field => field.name === 'couponsLimit')
    const appliedCodes = useAppliedCodes(props)

    return appliedCodes.length >= (couponLimit?.value ?? 5);
}
```


#### Constants

Added new consts in **constants.js**

```js
(...)
export const AVAILABLE_CODES_NAMES = {
  DISCOUNT_CODES: 'discount_codes',
  APPLIED_CODES: 'applied_codes',
}
export const CODES_STATUSES = {
  APPLIED: 'APPLIED',
  NEW: 'NEW',
  DELETED: 'DELETED'
}
export const CODES_TYPES = {
  UNIT: 'UNIT',
}
export const CUSTOM_LINE_ITEM_VOUCHER_SLUG = 'Voucher, '
```

## Contributing

Bug reports and pull requests are welcome through [GitHub Issues](https://github.com/voucherifyio/sunrise-for-commerce-tools-integration/issues).


## Changelog
- 2022-10-12 `v4.1.0` - fixed clearing cart after refreshing summary page, added auto refreshing shipping methods (fix bug free shipping not showing after applying code), added direct discounts  
- 2022-09-09 `v4.0.0` - add number of coupons limitations, adjustment for node >= 17, add info when validation fails
- 2022-08-25 `v3.0.2` - listing promotions on the OrderOverview page
- 2022-08-25 `v3.0.1` - added promotion tier handling
- 2022-08-19 `v3.0.0` - changed how `Custom Line Item` with discount is tracked and some small fixes
- 2022-08-02 `v2.0.0` - Remove coupon code by changing the status to `DELETED`. It allows to remove coupon from session by [Commerce Tools Integration v2.0.0 or higher](https://github.com/voucherifyio/commerce-tools-integration)
- 2022-07-26 `v1.0.0` - Initial release

## Contact

Use our contact form https://www.voucherify.io/contact-sales

## Licence

``` 
Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/
```

