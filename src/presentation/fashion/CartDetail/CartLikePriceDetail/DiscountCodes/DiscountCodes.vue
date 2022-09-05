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
        <div v-for="code in appliedCodes" :key="code">
          <discount-code :code="code" :cart="cart" :editable="editable"></discount-code>
        </div>
    </div>
  </div>
</template>
