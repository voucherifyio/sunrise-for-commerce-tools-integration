<style src="./DiscountCode.css" scoped></style>
<script src="./DiscountCode.js"></script>

<template>
  <div class="code-container">
    <b>{{code.banner || code.code}}</b>
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