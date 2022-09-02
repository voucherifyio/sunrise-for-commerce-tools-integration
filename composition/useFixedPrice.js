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