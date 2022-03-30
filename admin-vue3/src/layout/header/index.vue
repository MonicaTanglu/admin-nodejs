<!--  -->
<template>
  <div class="app-avatar">
    <a-dropdown>
      <span class="ant-dropdown-link">
        <a-avatar :src="userInfo.avatar" />
        {{ userInfo?.username }}
        <DownOutlined />
      </span>
      <!--  收纳部分template  -->
      <template #overlay>
        <a-menu>
          <a-menu-item @click="updatePwd">修改密码</a-menu-item>
          <a-menu-item @click="Logout">退出登录</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <modal-form
      ref="modalPwdForm"
      :key="0"
      :formArr="formData"
      @submit="submit"
    ></modal-form>
  </div>
</template>

<script>
import { DownOutlined } from "@ant-design/icons-vue";
import { reactive, toRefs, ref } from "vue";
import { useStore } from "vuex";
import { message, Modal } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";
import ModalForm from "@/components/form/ModalForm.vue";
import { putAction } from "@/api/api";
import { setModalLoading, handleCommonAdd } from "@/utils/common";
export default {
  components: {
    DownOutlined,
    ModalForm,
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const modalPwdForm = ref();
    const state = reactive({
      userInfo: store.getters.userInfo,
      updVisible: false,
      formData: [
        {
          label: "原密码",
          type: "password",
          key: "old_password",
          value: "",
          required: true,
        },
        {
          label: "新密码",
          type: "password",
          key: "new_password",
          value: "",
          required: true,
        },
        {
          label: "确认密码",
          type: "password",
          key: "confirm_password",
          value: "",
          required: true,
        },
      ],
    });
    const setLog = () => {
      store.dispatch("user/Logout").then(() => {
        message.success("退出成功");
        router.replace({
          path: "user/login",
          query: {
            redirect: route.fullPath,
          },
        });
      });
    };
    /* 用户登出 */
    const Logout = () => {
      Modal.confirm({
        title: "您确定退出登录吗?",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          setLog();
        },
      });
    };

    const updatePwd = () => {
      handleCommonAdd(modalPwdForm.value);
    };
    const submit = async (e) => {
      let res;
      if (e.new_password !== e.confirm_password) {
        message.warning("密码不一致！");
        modalPwdForm.value.confirmLoading = false;
        return;
      }
      res = await putAction("/system/updatePwd", e).catch(
        () => (modalPwdForm.value.confirmLoading = false)
      );
      if (res) {
        message.success("修改成功，即将重新登录");
        setTimeout(setLog, 1000);
        setModalLoading(modalPwdForm.value);
      }
    };

    return {
      ...toRefs(state),
      Logout,
      updatePwd,
      modalPwdForm,
      submit,
    };
  },
};
</script>
<style lang='less' scoped>
.app-avatar {
  .ant-dropdown-link {
    display: block;
    min-height: 64px;
    cursor: pointer;
  }
}
</style>