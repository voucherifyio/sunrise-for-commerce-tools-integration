<style src="./style.css" scoped></style>
<i18n src="./DiscountCodes.txt" lang="yaml"></i18n>
<script src="./DiscountCodes.js"></script>

<template>

 
  <div class="single-grand-total">
    <!-- {{cart.custom.customFieldsRaw}} -->
    <div class="single-grand-total-left col-sm-6">
      <span>{{ t('appliedDiscounts') }}</span>
    </div>
    <div
      class="single-grand-total-right col-sm-6"
      data-test="discount-code-name"
    >
    {{cart.custom.customFieldsRaw[0].value[0]}}

    <!-- <div
        v-for="(_, name, value) in cart.custom.customFieldsRaw"
        :key="name"
      >
      <div v-if="name==='discount_codes'">
        <div v-for="code in value" :key="code">
          <b>blabla{{code}}</b>
        </div>
      </div>

    </div> -->
    </div>
  </div>

</template>
