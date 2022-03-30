<template>
  <div>
    <a-form
      ref="formRef"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <div>
        <a-form-item
          :label="formArr[0].label"
          :name="formArr[0].key"
          :rules="validatorRules[formArr[0].key].rules"
        >
          <a-radio-group v-model:value="form.menuType">
            <a-radio
              v-for="option of formArr[0].options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}</a-radio
            >
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :label="formArr[1].label"
          :name="formArr[1].key"
          :rules="validatorRules[formArr[1].key].rules"
        >
          <a-input
            v-model:value="form.name"
            :placeholder="'请输入' + formArr[1].label"
          />
        </a-form-item>

        <a-form-item
          v-if="form[formArr[0].key] === 1"
          :label="formArr[2].label"
          :name="formArr[2].key"
          :rules="validatorRules[formArr[2].key].rules"
        >
          <a-tree-select
            show-search
            :tree-data="formArr[2].options"
            v-model:value="form.parentId"
            :placeholder="'请选择' + formArr[2].label"
            :field-names="{ label: 'name', key: 'id', value: 'id' }"
          >
          </a-tree-select>
        </a-form-item>

        <a-form-item
          :label="formArr[3].label"
          :name="formArr[3].key"
          :rules="validatorRules[formArr[3].key].rules"
        >
          <a-input
            v-model:value="form.url"
            :placeholder="'请输入' + formArr[3].label"
          />
        </a-form-item>

        <!-------------按钮权限------------------->
        <template v-if="form[formArr[0].key] === 2">
          <a-form-item
            :label="formArr[4].label"
            :name="formArr[4].key"
            :rules="validatorRules[formArr[4].key].rules"
          >
            <a-input
              v-model:value="form.perms"
              :placeholder="'请输入' + formArr[4].label"
            />
          </a-form-item>
          <a-form-item
            :label="formArr[5].label"
            :name="formArr[5].key"
            :rules="validatorRules[formArr[5].key].rules"
          >
            <a-radio-group v-model:value="form.permsType">
              <a-radio
                v-for="option of formArr[5].options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.text }}</a-radio
              >
            </a-radio-group>
          </a-form-item>
        </template>
        <!-------非按钮权限-------->
        <template v-else>
          <a-form-item
            :label="formArr[6].label"
            :name="formArr[6].key"
            :rules="validatorRules[formArr[6].key].rules"
          >
            <a-input
              v-model:value="form.component"
              :placeholder="'请输入' + formArr[6].label"
            />
          </a-form-item>
          <a-form-item
            :label="formArr[7].label"
            :name="formArr[7].key"
            :rules="validatorRules[formArr[7].key].rules"
          >
            <a-input
              v-model:value="form.redirect"
              :placeholder="'请输入' + formArr[7].label"
            />
          </a-form-item>
          <a-form-item
            :label="formArr[8].label"
            :name="formArr[8].key"
            :rules="validatorRules[formArr[8].key].rules"
          >
            <a-input
              v-model:value="form.icon"
              :placeholder="'请输入' + formArr[8].label"
            />
          </a-form-item>
          <a-form-item
            :label="formArr[9].label"
            :name="formArr[9].key"
            :rules="validatorRules[formArr[9].key].rules"
          >
            <a-input-number
              :min="1"
              v-model:value="form.sortNo"
              :placeholder="'请输入' + formArr[9].label"
            />
          </a-form-item>
          <a-form-item
            :label="formArr[10].label"
            :name="formArr[10].key"
            :rules="validatorRules[formArr[10].key].rules"
          >
            <a-switch
              v-model:checked="form.route"
              :checked-children="formArr[10].options[0]"
              :un-checked-children="formArr[10].options[1]"
            />
          </a-form-item>
          <a-form-item
            :label="formArr[11].label"
            :name="formArr[11].key"
            :rules="validatorRules[formArr[11].key].rules"
          >
            <a-switch
              v-model:checked="form.hidden"
              :checked-children="formArr[11].options[0]"
              :un-checked-children="formArr[11].options[1]"
            />
          </a-form-item>
          <a-form-item
            :label="formArr[12].label"
            :name="formArr[12].key"
            :rules="validatorRules[formArr[12].key].rules"
          >
            <a-switch
              v-model:checked="form.keepAlive"
              :checked-children="formArr[12].options[0]"
              :un-checked-children="formArr[12].options[1]"
            />
          </a-form-item>
          <a-form-item
            :label="formArr[13].label"
            :name="formArr[13].key"
            :rules="validatorRules[formArr[13].key].rules"
          >
            <a-switch
              v-model:checked="form.alwaysShow"
              :checked-children="formArr[13].options[0]"
              :un-checked-children="formArr[13].options[1]"
            />
          </a-form-item>
        </template>
      </div>

      <a-form-item :wrapper-col="{ span: 14, offset: 4 }" v-if="actionShow">
        <a-button type="primary" @click="onSubmit">确定</a-button>
        <a-button style="margin-left: 10px" @click="cancel">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, nextTick } from "vue";

export default defineComponent({
  props: {
    formArr: {
      type: Array,
      default: () => [],
    },
    actionShow: {
      type: Boolean,
      default: true,
    },
  },
  setup(props: any, context) {
    const state = reactive({
      loading: false,
      validatorRules: {},
      formObj: {},
    });
    const labelCol = { span: 6 };
    const wrapperCol = { span: 16 };
    const formRef = ref();

    const cancel = () => {
      context.emit("cancel");
    };
    const setInitForm = () => {
      let obj = {};
      for (const item of props.formArr) {
        obj[item.key] = item.value;
      }
      return obj;
    };
    let form = reactive(setInitForm());
    const onSubmit = async () => {
      formRef.value
        .validate()
        .then(async (value) => {
          // let value = await formRef.value.validateFields();
          if (state.formObj && state.formObj["id"])
            value["id"] = state.formObj["id"];
          context.emit("submit", value);
        })
        .catch(() => {
          context.emit("error", true);
        });
    };
    const resetForm = () => {
      for (let key in form) {
        form[key] = null;
      }
    };
    const setForm = async (list) => {
      state.formObj = form;
      let obj = {};
      for (const item of list) {
        if (Object.prototype.hasOwnProperty.call(state.formObj, item.key)) {
          state.formObj[item.key] = item.value;
        }
        obj[item.key] = item.value;
      }
      await nextTick();
      form = {...state.formObj};
      state.formObj = obj;
    };
    const getErrMsg = (type) => {
      let errMsg = "";
      switch (type) {
        case "input":
        case "textarea":
          errMsg = "请输入";
          break;
        case "select":
        case "radio":
        case "datePicker":
        case "checkbox":
          errMsg = "请选择";
          break;
        case "uploadImage":
        case "uploadFile":
          errMsg = "请上传";
          break;
        default:
          break;
      }
      return errMsg;
    };
    const setValidator = (list) => {
      for (const item of list) {
        let errMsg = getErrMsg(item.type);
        state.validatorRules[item.key] = {
          rules: [
            {
              required: item.required ? item.required : false,
              message: item.pattern ? item.errMsg : errMsg + item.label,
              pattern: item.pattern,
              type: item.fieldType ? item.fieldType : "string",
            },
          ],
          initialValue: item.value,
          valuePropName: item.valuePropName ? item.valuePropName : "value",
        };
      }
    };
    setValidator(props.formArr);
    return {
      labelCol,
      wrapperCol,
      ...toRefs(state),
      form,
      resetForm,
      onSubmit,
      cancel,
      formRef,
      setForm,
    };
  },
});
</script>
