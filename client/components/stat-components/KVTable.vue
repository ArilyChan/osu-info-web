<template>
  <b-table-simple
    hover
    small
    responsive
    striped
    class="p-0 m-0 border-0"
  >
    <colgroup><col><col></colgroup>
    <b-tbody>
      <b-tr
        v-for="(value, name) of kvStats"
        :key="`grade-count-${name}`"
      >
        <b-th class="text-right text-uppercase">
          {{ name }}
        </b-th>
        <b-td v-html="value" />
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
export default {
  props: {
    kvStats: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
