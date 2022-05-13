<style src="./style.css" scoped></style>
<i18n src="./DiscountCodes.txt" lang="yaml"></i18n>
<script src="./DiscountCodes.js"></script>

<template>

 
  <div class="single-grand-total">
    <div class="single-grand-total-left col-sm-6">
      <span>{{ t('appliedDiscounts') }}</span>
    </div>
    <div
      class="single-grand-total-right col-sm-6"
      data-test="discount-code-name"
    >
    <div
        v-for="(custom) in cart.custom.customFieldsRaw"
        :key="custom.name"
      >
      <div v-if="custom.name == 'discount_codes'">
        <div v-for="code in custom.value" :key="code">
          <b>{{code}}</b>
          <RemoveDiscountCodeForm
            v-if="editable"
          />
        </div>
          
      </div>

    </div>
    </div>
  </div>

</template>
