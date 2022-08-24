<style src="./style.css" scoped></style>
<i18n src="./DiscountCodes.txt" lang="yaml"></i18n>
<script src="./DiscountCodes.js"></script>

<template>
  <div class="single-grand-total mb-0" v-if="appliedCodes">
    <div class="single-grand-total-left col-sm-6">
      <span>{{ t('appliedDiscounts') }}</span>
    </div>
  </div>
  <div class="single-grand-total">
    <div
      class="single-grand-total-right col-sm-12"
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
