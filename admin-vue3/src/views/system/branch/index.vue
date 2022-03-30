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
        :pagination="false"
        :dataSource="dataSource"
        :loading="loading"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a @click="handleEdit(record)">编辑</a>
            <a-button
              class="m-l-10"
              type="link"
              danger
              @click="handleDelete(record.id)"
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
  </a-card>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { columns, formArr, OptionsCustom } from "./config";
import { getAction, postAction } from "@/api/api";
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
      // modalForm: ref("modalForm"),
      currentId: "",
    });
    const modalForm = ref();
    const urlObj = {
      list: "/system/getBranchPage",
      delete: "/system/deleteBranch",
    };
    const getBranchList = async () => {
      loading.value = true;
      let res = await getAction<[]>(urlObj.list);
      if (res) state.dataSource = res.result;
      let options = [...state.dataSource];
      options.unshift({ id: "0", name: "----" });
      state.formData[1].options = options;
      //   state.formData[1].options as OptionsCustom[];
      loading.value = false;
    };
    getBranchList();

    const handleEdit = (obj) => {
      state.currentId = obj.id;
      setTimeout(() => {
        handleCommonEdit(modalForm.value, obj);
      }, 100);
    };
    const handleDelete = (id) => {
      singleDeleteCommon(urlObj.delete, id, loading, (bl) => {
        if (bl) getBranchList();
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
      res = await postAction("/system/branchEdit/" + e["id"], e);
      if (res) {
        message.success("操作成功");
        setModalLoading(modalForm.value);
        getBranchList();
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
      handleDelete,
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
