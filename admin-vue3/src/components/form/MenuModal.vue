<template>
  <a-drawer
    :title="title"
    :width="700"
    @close="handleCancel"
    v-model:visible="visible"
    style="height: 100%; overflow: auto; padding-bottom: 53px"
  >
    <!-- <template #title>
      <div style="width: 100%">
        <span>{{ title }}</span>
        <span
          style="
            display: inline-block;
            width: calc(100% - 51px);
            padding-right: 10px;
            text-align: right;
          "
        >
          <a-button
            @click="toggleScreen"
            icon="appstore"
            style="height: 20px; width: 20px; border: 0px"
          ></a-button>
        </span>
      </div>
    </template> -->
    <a-spin :spinning="confirmLoading">
      <menu-form
        ref="drawerCustomForm"
        :formArr="formArr"
        @submit="ok"
        @error="error"
        :actionShow="false"
      ></menu-form>
    </a-spin>

    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-popconfirm
        title="确定放弃编辑？"
        @confirm="handleCancel"
        okText="确定"
        cancelText="取消"
      >
        <a-button style="margin-right: 0.8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">
        提交
      </a-button>
    </div>
  </a-drawer>
</template>

<script lang="ts">
export interface FormArrObject {
  fieldType?: string;
  key: string;
  type: string;
  value: any;
  required?: boolean;
  errMsg?: string;
  disabled?: boolean;
  options?: Array<object>;
  label?: string;
}
import MenuForm from "./MenuForm.vue";
import {
  defineComponent,
  reactive,
  toRefs,
  PropType,
  ref,
  // nextTick,
} from "vue";

export default defineComponent({
  components: { MenuForm },
  props: {
    formArr: {
      type: Array as PropType<FormArrObject[]>,
      default: () => [],
    },
  },
  setup(props, context) {
    const drawerCustomForm = ref();
    let state = reactive({
      title: "操作",
      // visible: false,
      drawerWidth: 700,
      confirmLoading: false,
      modaltoggleFlag: true,
      disableSubmit: false,
    });
    const visible = ref<boolean>(false);
    // visible.value = false
    const close = () => {
      state.confirmLoading = false;
      visible.value = false;
      state.disableSubmit = false;
    };
    const handleCancel = () => {
      let form: FormArrObject[] = props.formArr;
      for (let item of form) {
        if (item.fieldType === "array") item.value = [];
        else item.value = null;
      }
      close();
    };
    const toggleScreen = () => {
      state.modaltoggleFlag = !state.modaltoggleFlag;
    };
    const handleSubmit = () => {
      state.confirmLoading = true;
      drawerCustomForm.value.onSubmit();
    };
    const ok = (e) => {
      context.emit("submit", e);
    };
    const error = () => {
      state.confirmLoading = false;
    };
    // 根据屏幕变化,设置抽屉尺寸
    const resetScreenSize = () => {
      let screenWidth = document.body.clientWidth;
      if (screenWidth < 500) {
        state.drawerWidth = screenWidth;
      } else {
        state.drawerWidth = 700;
      }
    };
    const edit = async (record) => {
      resetScreenSize();
      visible.value = true;

      let list = props.formArr;
      for (let i = 0, l = list.length; i < l; i++) {
        if (Object.prototype.hasOwnProperty.call(record,list[i].key)) {
          list[i].value = record[list[i].key];
        }
      }
      setTimeout(() => {
        drawerCustomForm.value.setForm(list);
      }, 500);
      // await nextTick();
    };
    // const addSub = async (record) => {

    // }
    const add = () => {
      visible.value = true;
      setTimeout(() => {
        drawerCustomForm.value.setForm(props.formArr);
      }, 500);
    };
    return {
      visible,
      state,
      ...toRefs(state),
      handleCancel,
      toggleScreen,
      handleSubmit,
      ok,
      error,
      edit,
      add,
      drawerCustomForm,
    };
  },
});
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
.ant-upload-select-picture-card i {
  font-size: 49px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 10px;
  padding-bottom: 10px;
}

.drawer-bootom-button {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>