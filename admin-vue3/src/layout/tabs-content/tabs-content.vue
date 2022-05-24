<template>
  <div class="tabs-content">
    <div>
      <!--  a-tabs 示例 -->
      <a-tabs
        v-model:activeKey="activeKey"
        hideAdd
        @change="changePage"
        @edit="removeTab"
        type="editable-card"
      >
        <a-tab-pane
          v-for="item in visitedRoutes"
          :key="item.fullPath"
          :tab="item.title"
        >
        </a-tab-pane>
      </a-tabs>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { watch, reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { ReactiveObject, RouteObject } from "./interfaceFile";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    let obj: ReactiveObject = {
      activeKey: route.fullPath,
      visitedRoutes: [],
    };
    const state = reactive(obj);
    const visitedRoutesSession = sessionStorage.getItem("tabItems");
    state.visitedRoutes = visitedRoutesSession
      ? JSON.parse(visitedRoutesSession)
      : [];
    watch(
      () => route.fullPath,
      (to) => {
        // let routes = state.visitedRoutes;
        if (!state.visitedRoutes) return;
        if (!state.visitedRoutes.find((item) => item.fullPath === to)) {
          const { fullPath, name, path, meta } = route;
          const routes = { fullPath, name, path, title: meta.title };
          state.visitedRoutes.push(routes);
          sessionStorage.setItem(
            "tabItems",
            JSON.stringify(state.visitedRoutes)
          );
          state.activeKey = to;
        } else {
          state.activeKey = to;
        }
      }
    );

    //切换tab
    const changePage = (key) => {
      state.activeKey = key;
      router.push(key);
    };

    //删除tab
    const removeTab = (fullPath) => {
      if (!state.visitedRoutes) return;
      if (state.visitedRoutes.length === 1) {
        return message.warning("这已经是最后一页,不能再删除了!");
      }
      const routePath: RouteObject | undefined = state.visitedRoutes.find(
        (item) => {
          return fullPath === item.fullPath;
        }
      );

      state.visitedRoutes.forEach((item, index) => {
        if (routePath && item.fullPath === routePath.fullPath) {
          if (!state.visitedRoutes) return;
          state.visitedRoutes.splice(index, 1);
        }
      });
    };

    return {
      ...toRefs(state),
      changePage,
      removeTab,
    };
  },
};
</script>
<style lang='less' scoped>
.tabs-content {
  border-top: 1px solid #eee;
  :deep .ant-tabs {
    // .ant-tabs-bar {
    //   padding: 4px 20px 0 10px;
    //   margin: 0;
    //   background-color: white !important;
    //   user-select: none;
    //   border-width: 0px !important;
    // }
    margin: 4px 16px 0 16px;
    .ant-tabs-tab {
      border-width: 0px !important;
      background: #fff !important;
    }
    .ant-tabs-tab-active {
      border-bottom: 2px solid var(--primary-6) !important;
    }
    .ant-tabs-nav {
      // padding-left: 16px;
      margin: 0 0 1px;
    }
    .ant-tabs-tabpane {
      display: none;
    }
  }

  .tabs-view-content {
    padding: 20px 14px 0;
    /*height: calc(100vh - #{$header-height});*/
    height: calc(100vh - 110px);
    overflow: auto;
  }
}
.content {
  margin: 0 16px;
  background: #fff;
  height: 800px;
  overflow-y: scroll;
}
</style>
<style lang="less">
.tabs-content .ant-tabs-nav-container {
  background: #fff;
}
</style>