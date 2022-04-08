<!--  -->
<template>
  <a-menu
    theme="dark"
    mode="inline"
    v-model:selectedKeys="selectedKeys"
    :inline-collapsed="collapsed"
  >
    <template v-for="items in menus" :key="items.name">
      <!-- 存在children子菜单 -->
      <a-sub-menu
        v-if="items.children && items.children.length > 0 && !items.hidden"
        :key="items.name"
      >
        <template v-slot:title>
          <span>
            <icon-font :type="items.meta.icon" />
            <span>{{ items.meta.title }}</span>
          </span>
        </template>
        <!-- 子菜单 -->
        <template v-for="item in items.children" :key="item.name">
          <a-menu-item
            :key="item.name"
            v-if="!item.hidden"
            @click="clickMenuItem(item.name, item.path)"
          >
            <!-- <icon-font style="font-size: 24px" :type="item.meta.icon" /> -->
            <span>{{ item.meta.title }}</span>
          </a-menu-item>
        </template>
      </a-sub-menu>

      <!-- 单独菜单 -->
      <a-menu-item
        v-else-if="
          (!items.children || items.children.length === 0) && !items.hidden
        "
        :key="items.name"
        @click="clickMenuItem(items.name, items.path)"
      >
        <icon-font
          v-if="items.meta && items.meta.icon"
          :type="items.meta.icon"
        />
        <span>{{ items.meta.title }}</span>
      </a-menu-item>
    </template>
  </a-menu>
  <!-- <router-view></router-view> -->
</template>

<script>
import { ref } from "vue";
// import IconFont from "@/components/iconfont/icon";
// import { computed } from "vue";
// import { useStore } from "vuex";
import { useRouter } from "vue-router";
// import { constantRoutes } from "@/router/index";
import store from "@/store/index";
export default {
  // components: {
  //   IconFont,
  // },

  props: {
    collapsed: {
      type: Boolean,
    },
  },

  setup() {
    // const store = useStore();
    const router = useRouter();
    // const menus = computed(() => store.getters.menus);
    // const menus = constantRoutes;
    const menus = store.getters.addRoutes;
    const selectedKeys = ref(["1"]);
    const clickMenuItem = (key, path) => {
      if (router.hasRoute(key)) {
        router.push(path);
      } else {
        router.push("/404");
      }
    };

    return {
      menus,
      selectedKeys,
      clickMenuItem,
    };
  },
};
</script>
<style lang='less' scoped>
.icon {
  font-size: 24px;
}
</style>