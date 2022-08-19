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

In **CartLikePriceDetail.vue** DiscountCodes component was made dependen on discountVoucherifyCodesExist and template about discount was a bit changed

```vue
<div>
    (...)
    <DiscountCodes
        v-if="discountVoucherifyCodesExist(cart)"
        :cart="cart"
        :editable="editable"
    />
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

export default {
  (...)
  computed: {
    discountValue(props) {
      const customLineItemWithDiscount = props.cart.customLineItems.find(item => item.slug.startsWith(CUSTOM_LINE_ITEM_VOUCHER_SLUG))
      if(customLineItemWithDiscount) {
        return customLineItemWithDiscount.totalPrice
      }
      return 0
    }
  }
};
```

### CartLikePriceDetail/DiscountCodes

> **DiscountCodes.js** was extended by computed property which map V% codes and component **BasePrice**
```js
import { AVAILABLE_CODES_NAMES, CODES_STATUSES } from "../../../../../constants";
export default {
  components: { RemoveDiscountCodeForm, BasePrice },
  (...)
  computed: {
    appliedCodes() {
        const appliedCodes = this.cart.custom?.customFieldsRaw
            .filter(field => field.name === AVAILABLE_CODES_NAMES.DISCOUNT_CODES)
            .reduce(customField => customField)
            .value
            .map(code => JSON.parse(code))
            .filter(code => code.status === CODES_STATUSES.APPLIED)

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
        <div class="row code-container" v-for="code in appliedCodes" :key="code">
          <b >{{code.code}}</b>
          <b class="code-gap"></b>
          <b class="code-value">
            <BasePrice :price="{value: {centAmount: -code.value, fractionDigits: cart.totalPrice.fractionDigits, currencyCode: cart.totalPrice.currencyCode}}" />
          </b>
          <RemoveDiscountCodeForm
            v-if="editable"
            :cart="cart"
            :code="code.code"
          />
        </div>
    </div>
  </div>
</template>
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

In **AddDiscountCodeForm.js** there are new logic for adding V% codes in applyDiscount() and watch that handle errors in added codes.

```js
(...)
import { ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';
import { CODES_STATUSES } from '../../../../constants'

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
};
```

### CartLikeContentDetail/LimeItemInfo

Here was shown a discount for single product

**LimeItemInfo.vue**

```vue
<td class="product-name">
  (...)
  <b class="discounted-quantity" v-if="quantityFromCode">
    {{ t('discounted') }} : {{quantityFromCode}}
  </b>
</td>
```

In **LimeItemInfo.js** was added computed function **quantityFromCode** that return unit type codes applied to products 

```js
import { AVAILABLE_CODES_NAMES, CODES_TYPES } from '../../../../../constants'
import { useI18n } from 'vue-i18n';

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
    };
  }
  (...)
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

### Other changes

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

Functions in **composition/useCartTools.js** for checking if V% discount codes exist and for returning it.

```js
import { AVAILABLE_CODES_NAMES } from '../src/constants'
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

