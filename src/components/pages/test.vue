<!-- Use preprocessors via the lang attribute! e.g. <template lang="pug"> -->
<template>
  <div id="app">
    <div>
      <ul class="country-list" @scroll="onScroll">
        <li v-for="country in countries" :key="country">
          {{ country }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      countries: ['Argentina', 'Brazil', 'Mexico', 'chile', 'United States', 'Canada', 'Germany', 'Spain']
    };
  },
  methods: {
    onScroll(e) {
      const { scrollTop, offsetHeight, scrollHeight } = e.target
      if ((scrollTop + offsetHeight) >= scrollHeight) {
        console.log('bottom!')
      }
    }
  }
};
</script>

<!-- Use preprocessors via the lang attribute! e.g. <style lang="scss"> -->
<style >
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: rgba(black, 5%);
}

.country-list {
  font-size: 2.5rem;
  max-height: 200px;
  overflow-y: auto;
  background-color: tomato;
  border: 2px solid black;
  color: white;
}
</style>
