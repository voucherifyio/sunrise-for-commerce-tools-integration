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


## Graphql request changes

Basic Graphql quary need to be extended due to recieving additional data about V% coupons. E.g code below.

### Request

```js
query myCart($locale: Locale!) {
    myCart: me {
        activeCart {
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

### Result

```js
{
    custom: {
        customFieldsRaw: {
            name: "discount_codes",
            //value elements needs to be parsed from stringified json to object
            value: [
                {
                    code: "50%OFF",
                    status:"APPLIED",
                    value:21450
                }
            ]
        }
    }
}
```

> Currently we handle only "discount_codes". If your code has status "APPLIED" it means that was validated correctly and applied discount to your cart.



# Changes in our sunrise fork

In purpose to use our commercetools example application Sunrise SPA https://github.com/commercetools/sunrise-spa with Voucherify integration
you need to make some changes in code. You can simply use our Sunrise fork with following changes


> CartDetail.vue is our main component related to cart There is only single change with passing cart object to AddDiscountCodeForm component
```vue
<AddDiscountCodeForm :cart="cart" />
```

> function that extends useCartMutation.js allowed to mark chagnes in application state

```js
  const applyVoucherifyDiscount = (code) =>
    mutateCart(addVoucherifyDiscountCode(code)); 
  const applyRemoveVoucherifyDiscountCode = () => 
    mutateCart(removeVoucherifyCode()) 
```

> RemoveDiscountCodeForm.js extended logic allowed to remove codes with on click method binded in RemoveDiscountCodeForm.vue
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

> DiscountCodes.js was extended by computed property which map V% codes and component BasePrice
```js
components: { RemoveDiscountCodeForm, BasePrice },
(...)
computed: {
    appliedCodes() {
      const appliedCodes = this.cart.custom?.customFieldsRaw
        .filter(field => field.name === 'discount_codes')
        .reduce(customField => customField)
        .value
        .map(code => JSON.parse(code))
        .filter(code => code.status === 'APPLIED')

      return appliedCodes.length ? appliedCodes : false
    }
  },
```


> DiscountCodes.vue template was changed a bit, added usage of BasePrice component and maping for appliedCodes from computed property
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
        <div class="code-container" v-for="code in appliedCodes" :key="code">
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

> In AddDiscountCodeForm.vue component ServeError was replaced from
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

