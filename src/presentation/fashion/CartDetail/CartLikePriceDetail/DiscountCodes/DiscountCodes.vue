<style src="./style.css" scoped></style>
<i18n src="./DiscountCodes.txt" lang="yaml"></i18n>
<script src="./DiscountCodes.js"></script>

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
          <b >{{code.code}}</b>
          <!-- <b>{{JSON.parse(code).value}}</b> -->
          <RemoveDiscountCodeForm
            v-if="editable"
            :cart="cart"
            :code="code.code"
          />
        </div>
    </div>
  </div>

</template>
