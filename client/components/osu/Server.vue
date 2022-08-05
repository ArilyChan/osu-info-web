<template>
  <b-card v-if="$store.state.server === 'ripple'" class="shadow">
    <b-card-img :src="require('~/assets/icons/ripple.svg')" />
  </b-card>
  <b-card v-else-if="$store.state.server === 'akatsuki'" class="shadow" no-body>
    <b-card-img :src="require('~/assets/icons/akatsuki.png')" />
  </b-card>
  <b-card v-else-if="$store.state.server === 'bancho'" class="shadow">
    <b-card-img :src="require('~/assets/icons/bancho.png')" />
  </b-card>
  <b-card v-else class="shadow">
    {{ $t(`server.${$store.state.server}`) }}
  </b-card>
</template>
