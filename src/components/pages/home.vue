<template>
  <div class="">
    <div class="grid grid-cols-2 fixed top-0 pt-[60px] w-[599px] border-b border-r bg-white z-30">

      <div v-for="tab of tabs">
        <div @click="changeTab(tab.id)" class="flex-center py-4 hover:bg-[#e7e7e8] relative cursor-pointer">
          <div
              class="font-semibold"
              :class="tab.id === currentTab ? 'text-black' : 'text-gray-500' "
          >{{ tab.name }}
          </div>
          <div v-if="tab.id === currentTab" class="bg-black w-[60px] absolute bottom-0 h-[4px] rounded-full"/>
        </div>
      </div>
    </div>

    <Posts
        :by="this.currentTab"
        :key="keyPostsComp"
        class="pt-12"
    />
  </div>
</template>

<script lang="ts">
import Posts from "@/components/Posts.vue";
import { mapActions, mapGetters } from "vuex";
import { FILTER_POST_BY } from "@/config/const";

export default {
  name: "Homepage",
  components: {
    Posts: Posts
  },
  created() {},
  computed: {
    ...mapGetters(["getAuthToken", "isLoggedIn"]),
  },
  data() {
    return {
      tabs: [{ name: 'For you', id: FILTER_POST_BY.DEFAULT }, { name: 'Following', id: FILTER_POST_BY.FOLLOWING }],
      currentTab: 0,
      keyPostsComp: 0,
    };
  },
  methods: {
    changeTab(status) {
      if (status === this.currentTab) return
      this.keyPostsComp += 1
      this.currentTab = status
    }
  },
  watch: {
    '$store.state.mutatePosts': function () {
      console.log('dauphaihau debug: change')
      this.keyPostsComp += 1
    }
  }
}

</script>

<style scoped>

</style>
