# Installation

- clone repository
- `npm install`
- add `.env` file generated in Commerce Tools during creation of new API Client (select `Sunrise SPA` option)
- consider importing test data into the Commerce Tools https://docs.commercetools.com/sdk/sunrise-data
- `npm run start`


# High level integration requirements



## Project changes

In purpose to use our commercetools example application Sunrise SPA https://github.com/commercetools/sunrise-spa with Voucherify integration
you need to make some changes in code. You can simply use our Sunrise fork or make changes on Your own with given steps.

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


```js
customFieldsRaw {
    name
    value
}
```

### Cover use cases

To flawless work of your frontend application you need to cover a few use case
- appliging single discount code to your cart
- listing single or multiple discount codes applied (we provide support for single and multiple code as well) 
- calculating discount and total value of your cart
- removing codes from your cart
- handle removing products of changing of their quantity (applied codes needs to be revalidated, some codes may be not able to apply after changes)
- 
