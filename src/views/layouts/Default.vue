<template>
  <div v-cloak>
    <Navbar />
    <v-content>
      <slot />
    </v-content>

  </div>
</template>

<script>
import Navbar from "../../components/Navbar";
export default {
  components: { Navbar },
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}
</style>
