<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary">
        <template #icon><icon-font type="icon-plus" /></template>
        新增</a-button
      >
    </div>

    <div>
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        已选择&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项&nbsp;&nbsp;
      </div> -->

      <a-table
        :columns="columns"
        :row-key="(record) => record.id"
        size="middle"
        :pagination="page"
        :dataSource="dataSource"
        :loading="loading"
        @change="pageChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="handleEdit(record)">编辑</a-button>
            <a-button type="link" @click="auth(record)">授权</a-button>
            <a-button type="link" danger @click="handleDelete(record.id)"
              >删除</a-button
            >
          </template>
        </template>
      </a-table>
    </div>

    <modal-form
      ref="modalForm"
      :key="currentId"
      :formArr="formData"
      @submit="submit"
    ></modal-form>

    <a-drawer
      v-model:visible="authVisible"
      :checkStrictly="true"
      :maskClosable="true"
      title="授权"
      placement="right"
    >
      <a-tree
        v-if="menuList && menuList.length > 0"
        :tree-data="menuList"
        checkable
        checkStrictly
        default-expand-all
        :height="700"
        :field-names="{ children: 'children', title: 'name', key: 'id' }"
        v-model:checkedKeys="menuAuthIds"
      >
      </a-tree>

      <div class="drawer-bootom-button">
        <a-button @click="handleDrawerCancel" style="margin-right: 0.8rem"
          >取消</a-button
        >
        <a-button @click="handleDrawerSubmit" type="primary" :loading="loading">
          提交
        </a-button>
      </div>
    </a-drawer>
  </a-card>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { columns, formArr, OptionsCustom } from "./config";
import { getAction, postAction, putAction } from "@/api/api";
import {
  singleDeleteCommon,
  handleCommonEdit,
  handleCommonAdd,
  setModalLoading,
} from "@/utils/common";
import ModalForm from "@/components/form/ModalForm.vue";
import { message } from "ant-design-vue";

export default defineComponent({
  components: { ModalForm },
  setup() {
    const loading = ref(false);
    const state = reactive({
      selectedRowKeys: [],
      dataSource: [] as OptionsCustom[],
      formData: formArr,
      authVisible: false,
      // modalForm: ref("modalForm"),
      currentId: "",
      menuList: [],
      menuAuthIds: {checked: []},
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
      },
    });
    const modalForm = ref();
    const urlObj = {
      list: "/system/getPositionPage",
      delete: "/system/deletePosition",
    };
    const getRoleList = async () => {
      loading.value = true;
      let res = await getAction<{ data: []; total: number }>(urlObj.list, {
        pageNo: state.page.current,
        pageSize: state.page.pageSize,
      });
      if (res) {
        state.dataSource = res.result.data;
        state.page.total = res.result.total;
      }

      loading.value = false;
    };
    getRoleList();
    const getPermissionList = async () => {
      let res = await getAction<[]>("/system/getMenuPage");
      if (res) state.menuList = res.result;
    };
    const auth = (obj) => {
      state.currentId = obj.id;
      getPermissionList();
      state.menuAuthIds.checked = obj.menu_id ? obj.menu_id.split(",") : [];
      state.authVisible = true;
    };
    const handleEdit = (obj) => {
      state.currentId = obj.id;
      setTimeout(() => {
        handleCommonEdit(modalForm.value, obj);
      }, 100);
    };
    const handleDelete = (id) => {
      singleDeleteCommon(urlObj.delete, id, loading, (bl) => {
        if (bl) getRoleList();
      });
    };
    const handleAdd = () => {
      state.currentId = "0";
      setTimeout(() => {
        handleCommonAdd(modalForm.value);
      }, 100);
    };
    const submit = async (e) => {
      let res;
      e["id"] = state.currentId;
      res = await postAction("/system/positionEdit/" + e["id"], e);
      if (res) {
        message.success("操作成功");
        setModalLoading(modalForm.value);
        getRoleList();
      }
    };
    const onSelectChange = (selectedRowKeys) => {
      state.selectedRowKeys = selectedRowKeys;
    };
    const pageChange = (page) => {
      state.page.current = page.current;
      getRoleList();
    };

    const handleDrawerSubmit = async () => {
      let res = await putAction("/system/role/auth/" + state.currentId, {
        menu_id: state.menuAuthIds.checked.join(','),
      });
      if(res) {
        getRoleList();
        state.authVisible = false
      }
    };
    const handleDrawerCancel = () => {
      state.authVisible = false;
    };
    return {
      ...toRefs(state),
      loading,
      handleAdd,
      handleEdit,
      handleDelete,
      onSelectChange,
      submit,
      modalForm,
      columns: columns,
      pageChange,
      auth,
      handleDrawerSubmit,
      handleDrawerCancel,
    };
  },
});
</script>
<style lang="less" scoped>
@import "~@/style/table.less";

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
