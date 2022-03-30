<template>
  <a-card>
    <div class="search-form">
      <a-form :model="formState" layout="inline" @submit="search">
        <a-form-item label="名称" name="name">
          <a-input v-model:value="formState.name" placeholder="字典名称" />
        </a-form-item>
        <a-form-item label="编码" name="code">
          <a-input v-model:value="formState.code" placeholder="字典编码" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">
            <icon-font type="icon-search" />
            查询
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <div>
      <div class="table-operator m-t-10 right">
        <a-button @click="handleAdd" type="primary">
          <template #icon><icon-font type="icon-plus" /></template>
          新增</a-button
        >
      </div>

      <div class="m-t-10">
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
            <template v-if="column.key === 'introduce'">
              <span :title="record[column.key]">{{
                $filters.ellipsis(record[column.key])
              }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <a-button type="link" @click="handleEdit(record)">
                <template #icon
                  ><icon-font type="icon-edit"></icon-font
                ></template>
                编辑</a-button
              >
              <a-button type="link" @click="getDictItemList(record.code)">
                <template #icon
                  ><icon-font type="icon-setting"></icon-font
                ></template>
                字典配置</a-button
              >
              <a-button type="link" danger @click="handleDelete(record.id)">
                <template #icon
                  ><icon-font type="icon-delete"></icon-font
                ></template>
                删除</a-button
              >
            </template>
          </template>
        </a-table>
      </div>

      <modal-form
        ref="modalForm"
        :key="modalRandomKey"
        :formArr="formData"
        @submit="submit"
      ></modal-form>

      <modal-form
        ref="modalItemForm"
        :key="currentId"
        :formArr="formItemData"
        @submit="submit"
      ></modal-form>

      <a-drawer
        v-model:visible="drawVisible"
        placement="right"
        width="700"
        @close="closeDrawer"
      >
        <div class="table-operator m-b-10 right">
          <a-button @click="handleAdd" type="primary">
            <template #icon><icon-font type="icon-plus" /></template>
            新增</a-button
          >
        </div>
        <a-table
          :columns="itemColumns"
          :row-key="(record) => record.id"
          size="middle"
          :pagination="itemPage"
          :dataSource="itemDataSource"
          :loading="itemLoading"
          @change="itemPageChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'value'">
              <span :title="record[column.key]">{{
                $filters.ellipsis(record[column.key])
              }}</span>
            </template>
            <template v-if="column.key === 'action'">
              <a-button type="link" @click="handleEdit(record)">
                <template #icon
                  ><icon-font type="icon-edit"></icon-font
                ></template>
                编辑</a-button
              >
              <a-button type="link" danger @click="handleDelete(record.id)">
                <template #icon
                  ><icon-font type="icon-delete"></icon-font
                ></template>
                删除</a-button
              >
            </template>
          </template>
        </a-table>
      </a-drawer>
    </div>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { columns, formArr, formDictArr, itemColumns } from "./config";
import ModalForm from "@/components/form/ModalForm.vue";
import {
  singleDeleteCommon,
  handleCommonEdit,
  handleCommonAdd,
  setModalLoading,
} from "@/utils/common";
import { getAction, postAction, putAction } from "@/api/api";
import { message } from "ant-design-vue";
interface FormState {
  name: string;
  code: string;
}
export default defineComponent({
  components: { ModalForm },
  setup() {
    const loading = ref(false);
    const itemLoading = ref(false);
    const drawVisible = ref(false);
    const state = reactive({
      selectedRowKeys: [],
      dataSource: [],
      itemDataSource: [],
      formData: formArr,
      formItemData: formDictArr,
      currentDictCode: "",
      handleType: "dict", // dict表示操作字典 item表示操作字典项
      // modalForm: ref("modalForm"),
      currentId: "",
      modalRandomKey: Math.random(),
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
      },
      itemPage: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: false,
      },
    });
    const formState = reactive<FormState>({ name: "", code: "" });
    const modalForm = ref();
    const modalItemForm = ref();
    const urlObj = {
      list: "/system/getDictPage",
      itemList: "/system/getDictItemPage",
      delete: "/system/deleteDict",
      deleteItem: "/system/deleteDictItem",
      put: "/system/updateDict",
    };

    const search = () => {
      getDictList();
    };
    /**获取数据 */
    const getDictList = async () => {
      loading.value = true;
      let res = await getAction<{ data: []; total: number }>(urlObj.list, {
        pageNo: state.page.current,
        pageSize: state.page.pageSize,
        name: formState.name,
        code: formState.code,
      });
      if (res) {
        state.dataSource = res.result.data;
        state.page.total = res.result.total;
      }

      loading.value = false;
    };
    getDictList();
    const getDictItemList = async (code) => {
      state.modalRandomKey = Math.random();
      // state.formData = formDictArr;
      state.handleType = "item";
      state.currentDictCode = code;
      drawVisible.value = true;
      itemLoading.value = true;
      let res = await getAction<{ data: []; total: number }>(urlObj.itemList, {
        pageNo: state.page.current,
        pageSize: state.page.pageSize,
        code: code,
      });
      if (res) {
        state.itemDataSource = res.result.data;
        state.itemPage.total = res.result.total;
      }
      itemLoading.value = false;
    };
    /**操作 */
    const handleEdit = (obj) => {
      state.currentId = obj.id;
      state.modalRandomKey = Math.random();
      setTimeout(() => {
        if (state.handleType === "dict") handleCommonEdit(modalForm.value, obj);
        else handleCommonEdit(modalItemForm.value, obj);
      }, 100);
    };
    const handleDelete = (id) => {
      const deleteUrl =
        state.handleType === "dict" ? urlObj.delete : urlObj.deleteItem;
      singleDeleteCommon(deleteUrl, id, loading, (bl) => {
        if (bl) getDictList();
      });
    };
    const handleAdd = () => {
      state.currentId = "";
      state.modalRandomKey = 0;
      setTimeout(() => {
        if (state.handleType === "dict") handleCommonAdd(modalForm.value);
        else handleCommonAdd(modalItemForm.value);
      }, 100);
    };
    const submit = async (e) => {
      let res;

      if (!state.currentId) {
        if (state.handleType === "dict") {
          res = await postAction("/system/addDict", e);
        } else {
          e["code"] = state.currentDictCode;
          res = await postAction("/system/addDictItem", e);
        }
      } else {
        e["id"] = state.currentId;
        if (state.handleType === "dict") {
          res = await putAction("/system/updateDict/" + e["id"], e);
        } else {
          e["code"] = state.currentDictCode;
          res = await putAction("/system/updateDictItem/" + e["id"], e);
        }
      }
      if (res) {
        message.success("操作成功");
        setModalLoading(modalForm.value);
        if (state.handleType === "dict") getDictList();
        else getDictItemList(state.currentDictCode);
      }
    };
    const onSelectChange = (selectedRowKeys) => {
      state.selectedRowKeys = selectedRowKeys;
    };
    const pageChange = (page) => {
      state.page.current = page.current;
      getDictList();
    };
    const itemPageChange = (page) => {
      state.itemPage.current = page.current;
      getDictItemList(state.currentDictCode);
    };
    const closeDrawer = () => {
      state.formData = formArr;
      state.handleType = "dict";
    };

    return {
      ...toRefs(state),
      formState,
      loading,
      itemLoading,
      handleAdd,
      handleEdit,
      handleDelete,
      onSelectChange,
      submit,
      modalForm,
      modalItemForm,
      columns: columns,
      itemColumns: itemColumns,
      pageChange,
      itemPageChange,
      search,
      getDictItemList,
      closeDrawer,
      drawVisible,
    };
  },
});
</script>

<style>
</style>