<style src="./Promotions.scss" lang="scss"></style>
<script src="./Promotions.js"></script>
<i18n src="./Promotions.txt" lang="yaml"></i18n>

<template>
<span class="promo-title">{{t('availablePromo')}}</span>
<div class="code-container" v-for="code in availablePromotions" :key="code">
  <b>{{code.banner}}</b>
  <b class="code-gap"></b>
  <a href="#" class="add-promo" @click.prevent="() => handlePromotion(code)">{{t('add')}}</a>
</div>
</template>