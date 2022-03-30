<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary">
        <template #icon><icon-font type="icon-plus" /></template>
        新增</a-button
      >
      <!-- <a-button
        @click="batchDel"
        v-if="selectedRowKeys.length > 0"
        ghost
        type="danger"
      >
        <template #icon><icon-font type="icon-delete"></icon-font></template>
        批量删除
      </a-button> -->
    </div>

    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        已选择&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项&nbsp;&nbsp;
      </div>

      <a-table
        :columns="columns"
        :scroll="{ x: 1500 }"
        :row-key="(record) => record.id"
        size="middle"
        :pagination="false"
        :dataSource="dataSource"
        :loading="loading"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'component'">
            <span :title="record[column.key]">{{
              $filters.ellipsis(record[column.key])
            }}</span>
          </template>
          <template v-else-if="column.key === 'page_url'">
            <span :title="record[column.key]">{{
              $filters.ellipsis(record[column.key])
            }}</span>
          </template>
          <template v-else-if="column.key === 'control_url'">
            <span :title="record[column.key]">{{
              $filters.ellipsis(record[column.key])
            }}</span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a @click="handleEdit(record)">编辑</a>

            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link">
                更多 <icon-font type="icon-down" />
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:;" @click="handleDetail(record)"
                      >详情</a
                    >
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" @click="handleAddSub(record.id)"
                      >添加下级</a
                    >
                  </a-menu-item>
                  <a-menu-item>
                    <!-- <a-popconfirm
                      title="确定删除吗?"
                      okText="确定"
                      cancelText="取消"
                      @confirm="() => handleDelete(record.id)"
                    > -->
                    <a href="javascript:;" @click="handleDelete(record.id)"
                      >删除</a
                    >
                    <!-- </a-popconfirm> -->
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </template>
      </a-table>
    </div>

    <menu-modal
      ref="modalForm"
      :key="currentId"
      :formArr="formData"
      @submit="submit"
    ></menu-modal>
  </a-card>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { columns, formArr } from "./config";
import { getAction, postAction } from "@/api/api";
import {
  batchDelCommon,
  singleDeleteCommon,
  handleCommonEdit,
  handleCommonDetail,
  handleCommonAdd,
  handleCommonAddSub,
  setModalLoading,
} from "@/utils/common";
import MenuModal from "@/components/form/DrawerModal.vue";
import { message } from "ant-design-vue";
export default defineComponent({
  components: { MenuModal },
  setup() {
    const loading = ref(false);
    const state = reactive({
      selectedRowKeys: [],
      dataSource: [],
      formData: formArr,
      // modalForm: ref("modalForm"),
      currentId: "",
    });
    const modalForm = ref();
    const urlObj = {
      list: "/system/getMenuPage",
      delete: "/system/deleteMenu",
      deleteBatch: "/sys/permission/deleteBatch",
    };
    const getPermissionList = async () => {
      loading.value = true;
      let res = await getAction<[]>(urlObj.list);
      if (res) state.dataSource = res.result;
      state.formData[1].options = state.dataSource;
      loading.value = false;
    };
    getPermissionList();

    const handleEdit = (obj) => {
      state.currentId = obj.id;
      setTimeout(() => {
        handleCommonEdit(modalForm.value, obj);
      }, 100);
    };
    const handleDetail = (obj) => {
      state.currentId = obj.id;
      setTimeout(() => {
        handleCommonDetail(modalForm.value, obj);
      }, 100);
      // handleCommonDetail(modalForm.value, obj);
    };
    const handleDelete = (id) => {
      singleDeleteCommon(urlObj.delete, id, loading, (bl) => {
        if (bl) getPermissionList();
      });
    };
    const handleAdd = () => {
      state.currentId = '0';
      setTimeout(() => {
        handleCommonAdd(modalForm.value);
      }, 100);
    };
    const handleAddSub = (parentId) => {
      state.currentId = '0';
      setTimeout(() => {
        handleCommonAddSub(modalForm.value, parentId);
      }, 100);
    };
    const batchDel = () => {
      batchDelCommon(
        urlObj.deleteBatch,
        state.selectedRowKeys,
        loading,
        (bl) => {
          if (bl) getPermissionList();
        }
      );
    };
    const submit = async (e) => {
      let res;
      if ((e.menuType === 1 || e.menuType === 2) && !e.parentId) {
        message.error("请检查你填的类型以及信息是否正确！");
        return;
      }
      if (state.currentId) {
        e["id"] = state.currentId;
        res = await postAction("/system/menuEdit/" + e["id"], e);
      } else {
        res = await postAction("/system/menuEdit/0", e);
      }
      if (res) {
        message.success("操作成功");
        setModalLoading(modalForm.value);
        getPermissionList();
      }
    };
    const onSelectChange = (selectedRowKeys) => {
      state.selectedRowKeys = selectedRowKeys;
    };
    return {
      ...toRefs(state),
      loading,
      handleAdd,
      handleEdit,
      handleAddSub,
      handleDetail,
      handleDelete,
      batchDel,
      onSelectChange,
      submit,
      modalForm,
      columns: columns,
    };
  },
});
</script>
<style lang="less">
@import "~@/style/table.less";
</style>
