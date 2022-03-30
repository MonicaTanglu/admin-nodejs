<!--  -->
<template>
  <div class="login-container">
    <!-- <a-row>
      <a-col :xs="0" :md="0" :sm="12" :lg="14" :xl="16"></a-col>
      <a-col :xs="24" :sm="24" :md="12" :lg="10" :xl="6"> -->
    <div class="login-container-form">
      <header>
        <img src="@/assets/images/logo.png" />
        <h1>vue3-admin</h1>
      </header>
      <a-form ref="formRef" :model="formState" @submit.prevent="handleSubmit">
        <a-form-item
          name="loginname"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input
            v-model:value="formState.loginname"
            size="large"
            placeholder="用户名"
          >
            <template v-slot:prefix><user-outlined /></template>
          </a-input>
        </a-form-item>
        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input
            v-model:value="formState.password"
            size="large"
            type="password"
            placeholder="密码"
          >
            <template v-slot:prefix><lock-outlined /></template>
          </a-input>
        </a-form-item>

        <!-- <a-row :gutter="0">
          <a-col :span="16">
            <a-form-item
              name="captcha"
              :rules="[{ required: true, message: '请输入验证码' }]"
            >
              <a-input
                v-model:value="formState.captcha"
                size="large"
                placeholder="验证码"
              >
                <template v-slot:prefix>
                  <smile-outlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8" style="text-align: right">
            <img
              v-if="requestCodeSuccess"
              style="margin-top: 2px"
              :src="randCodeImage"
              @click="handleChangeCheckCode"
            />
            <img
              v-else
              style="margin-top: 2px"
              src="@/assets/checkcode.png"
              @click="handleChangeCheckCode"
            />
          </a-col>
        </a-row> -->

        <a-form-item>
          <a-button type="primary" size="large" @click="handleSubmit" block>
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <!-- </a-col>
    </a-row> -->
  </div>
</template>

<script lang="ts">
import {
  UserOutlined,
  LockOutlined,
  // SmileOutlined,
} from "@ant-design/icons-vue";
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
// import { getAction } from "@/api/api";
interface FormState {
  loginname: string;
  password: string;
  checkKey: string | null;
  captcha: string;
}
export default defineComponent({
  name: "Login",
  components: {
    UserOutlined,
    LockOutlined,
    // SmileOutlined,
  },
  setup() {
    const formState = reactive<FormState>({
      loginname: "",
      password: "",
      captcha: "",
      checkKey: null,
    });
    // let randImgTimestamp = Date.now();
    /**
     * 获取验证码
     */
    const randCodeImage = ref<string>("");
    const requestCodeSuccess = ref(false);
    // const handleChangeCheckCode = () => {
    //   formState.checkKey = Date.now().toString();
    //   formState.captcha = "";
    //   getAction<string>(`/sys/randomImage/${formState.checkKey}`)
    //     .then((res) => {
    //       let { success, result } = res;
    //       if (success) {
    //         randCodeImage.value = result;
    //         requestCodeSuccess.value = true;
    //       } else {
    //         requestCodeSuccess.value = false;
    //       }
    //     })
    //     .catch(() => {
    //       requestCodeSuccess.value = false;
    //     });
    // };
    // handleChangeCheckCode();
    const store = useStore();
    const router = useRouter();
    // const route = useRoute();
    const formRef = ref();
    const handleSubmit = async () => {
      formRef.value.validate().then(async () => {
        // if (!err) {
        // formState.checkKey = ;
        const res = await store.dispatch("user/Login", formState);
        if (res) router.replace("/");
        // }
      });
    };

    /* 返回 */
    return {
      randCodeImage,
      requestCodeSuccess,
      formState,
      formRef,
      handleSubmit,
      // handleChangeCheckCode,
    };
  },
});
</script>
<style lang='less' scoped>
.login-container {
  height: 100vh;
  // background: url("~@/assets/images/login/login_bg.png");
  background: #f0f2f5 url("~@/assets/background.svg") no-repeat 50%;
  background-size: cover;
  // text-align: center;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  &-form {
    // width: calc(100% - 40px);
    // height: 380px;
    padding: 4vh;
    // margin-top: calc((100vh - 380px) / 2);
    margin-right: 20px;
    margin-left: 20px;
    height: 420px;
    // background: url("~@/assets/images/login/login_form.png");
    background-size: 100% 100%;
    border-radius: 10px;
    box-shadow: 0 2px 8px 0 rgba(7, 17, 27, 0.06);
    background-color: #fff;

    width: 500px;
    margin-top: 20vh;
    display: inline-block;

    header {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      img {
        display: inline-block;
        width: 40px;
      }

      h1 {
        margin-bottom: 0;
        font-size: 24px;
        color: #222;
        text-align: center;
      }
    }

    form {
      // display: flex;
      // align-items: center;
      // flex-direction: column;
      padding: 0 40px;
      width: 100%;
      margin-top: 40px;
    }
  }
}
</style>