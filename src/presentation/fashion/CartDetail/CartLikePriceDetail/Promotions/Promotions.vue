<script src="./Promotions.js"></script>

<template>
    <!-- <div class="single-grand-total" v-if="availablePromotions">
        <div
          class="single-grand-total-right col-sm-12"
          data-test="discount-code-name"
        >
            <div class="code-container" v-for="code in availablePromotions" :key="code">
              <b >{{code.banner}}</b>
              <b class="code-gap"></b>
              <b class="code-value">
                <BasePrice :price="{value: {centAmount: -code.value, fractionDigits: cart.totalPrice.fractionDigits, currencyCode: cart.totalPrice.currencyCode}}" />
              </b>
              <button>ADD</button>
            </div>
        </div>
      </div> -->

<div class="code-container" v-for="code in availablePromotions" :key="code">
{{code.banner}}
    <!-- <BaseForm
        :onSubmit="applyPromotion"
      >
        <div class="discount-code">
        <b>{{code.banner}}</b>
        <button
            class="coupon-btn"
            type="submit"
        >
            {{ t('add') }}
        </button>
        </div>
  </BaseForm> -->
</div>
</template>