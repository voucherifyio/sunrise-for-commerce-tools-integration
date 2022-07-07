# Installation

- clone repository
- `npm install`
- add `.env` file generated in Commerce Tools during creation of new API Client (select `Sunrise SPA` option)
- consider importing test data into the Commerce Tools https://docs.commercetools.com/sdk/sunrise-data
- `npm run start`


# High level integration requirements

## Cover use cases

To flawless work of your frontend application you need to cover a few use case
- appliging single discount code to your cart
- listing single or multiple discount codes applied (we provide support for single and multiple code as well) 
- calculating discount and total value of your cart
- removing codes from your cart
- handle removing products of changing of their quantity (applied codes needs to be revalidated, some codes may be not able to apply after changes)
- handle coupons that add new products to your cart

## Graphql request changes

Basic Graphql quary need to be extended due to recieving additional customFields where data about V% codes are stored.

### Request example

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
          //each value element needs to be parsed from stringified json to object 
          //"{\"code\":\"UNIT_TYPE_CODE\",\"type\":\"UNIT\",\"effect\":\"ADD_MISSING_ITEMS\",\"quantity\":1,\"totalDiscountQuantity\":1}"
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
        //each value element needs to be parsed from stringified json to object
        //"{\"code\":\"UNIT_TYPE_CODE\",\"status\":\"APPLIED\",\"value\":17900}"
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


# Changes in our sunrise fork

In purpose to use our commercetools example application Sunrise SPA https://github.com/commercetools/sunrise-spa with Voucherify integration
you need to make some changes in code. You can simply use our Sunrise fork with following changes

> **CartDetail.vue** is our main component related to cart. There is only single change - passing cart object to **AddDiscountCodeForm** component This component contains two main children where chagnes was realized. 
- CartLikePriceDetail,
- AddDiscountCodeForm,
- CartLikeContentDetail

```vue
<AddDiscountCodeForm :cart="cart" />
```

### CartLikePriceDetail

> In **CartLikePriceDetail.vue** DiscountCodes component was made dependen on discountVoucherifyCodesExist and template about discount was a bit changed
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

> **CartLikePriceDetail.js** was extended by logic that allow to filter and get data about current applied voucher 

```js
import {CUSTOM_LINE_ITEM_VOUCHER_NAME} from '../../../../constants'

export default {
  (...)
  computed: {
    discountValue(props) {
      const customLineItemWithDiscount = props.cart.customLineItems.find(item => item.name.startsWith(CUSTOM_LINE_ITEM_VOUCHER_NAME))
      if(customLineItemWithDiscount) {
        return customLineItemWithDiscount.totalPrice
      }
      return 0
    }
  }
};
```

#### CartLikePriceDetail/DiscountCodes

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

> **DiscountCodes.vue** template was changed a bit, added usage of **BasePrice** component and maping for appliedCodes from computed property
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

> In **DiscountCodes/style.css** style was added
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

#### CartLikePriceDetail/DiscountCodes/RemoveDiscountCodeForm

> **RemoveDiscountCodeForm.js** extended logic allowed to remove codes with on click method binded in **RemoveDiscountCodeForm.vue**
```js 
setup(props) {
  const {
  returnVoucherifyCodes,
  applyVoucherifyDiscount,
  } = useCartTools();

  const removeDiscount = () => {
  const codes = returnVoucherifyCodes(props.cart)
      .map(code => JSON.parse(code))
      .filter(code => code.code != props.code)
      
  applyVoucherifyDiscount(codes)
  };
  return { removeDiscount };
},
```

### AddDiscountCodeForm

> In **AddDiscountCodeForm.vue** component ServeError was replaced from
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


> In **AddDiscountCodeForm.js** there are new logic for adding V% codes in applyDiscount() and watch that handle errors in added codes.

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
      const codes = returnVoucherifyCodes(props.cart)
        .map(code => JSON.parse(code))
        .filter(code => Object.values(CODES_STATUSES).includes(code.status));

      enteredCode.value = form.value.code
      form.value.code = ''
      return applyVoucherifyDiscount([...codes, { code: enteredCode.value, status: CODES_STATUSES.NEW }])
    };

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
          message: lastAppliedCode ? `${lastAppliedCode.status !== 'APPLIED' && lastAppliedCode.errMsg ? lastAppliedCode.errMsg : lastAppliedCode.status}` : '',
          status: lastAppliedCode.status === 'APPLIED' ? true : false,
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


//HERE JS CHANGES


### CartLikeContentDetail

#### CartLikeContentDetail/LimeItemInfo

> here was shown a discount for single product

> **LimeItemInfo.vue**

```vue
<td class="product-name">
  (...)
  <b class="discounted-quantity" v-if="quantityFromCode">
    {{ t('discounted') }} : {{quantityFromCode}}
  </b>
</td>
```

> In **LimeItemInfo.js** was added computed function quantityFromCode that return 

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

> in **LimeItemInfo.txt** new translate was added

```txt
en:
  available: "Available"
  discounted: "Discounted"
de:
  available: "Verfügbar"
  discounted: "Ermäßigt"
```

### Other changes

> function that extends **useCartMutation.js** allowed to mark chagnes in application state

```js
const applyVoucherifyDiscount = (code) =>
    mutateCart(addVoucherifyDiscountCode(code)); 
const applyRemoveVoucherifyDiscountCode = () => 
    mutateCart(removeVoucherifyCode()) 
```

> functions in **composition/ct/useCartMutation.js** that are handles for changing in codes

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

> Added new consts in **constants.js**

```js
(...)
export const AVAILABLE_CODES_NAMES = {
  DISCOUNT_CODES: 'discount_codes',
  APPLIED_CODES: 'applied_codes',
}
export const CODES_STATUSES = {
  APPLIED: 'APPLIED',
  NEW: 'NEW'
}
export const CODES_TYPES = {
  UNIT: 'UNIT',
}
export const CUSTOM_LINE_ITEM_VOUCHER_NAME = 'Voucher, '
```

