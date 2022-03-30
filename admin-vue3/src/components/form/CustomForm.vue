<template>
  <div>
    <a-form
      ref="formRef"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <div v-for="item of formArr" :key="item.key">
        <a-form-item
          v-if="item.type === 'input'"
          :label="item.label"
          :name="item.key"
          :rules="validatorRules[item.key].rules"
        >
          <a-input
            v-model:value="form[item.key]"
            :placeholder="'请输入' + item.label"
          />
        </a-form-item>

        <a-form-item
          v-if="item.type === 'password'"
          :label="item.label"
          :name="item.key"
          :rules="validatorRules[item.key].rules"
        >
          <a-input-password
            v-model:value="form[item.key]"
            :placeholder="'请输入' + item.label"
          />
        </a-form-item>

        <a-form-item
          v-if="item.type === 'autoComplete'"
          :label="item.label"
          :name="item.key"
          :rules="[validatorRules[item.key]]"
        >
          <a-auto-complete
            v-model:value="form[item.key]"
            :options="item.options"
            style="width: 100%"
            :placeholder="'请输入' + item.label"
            @search="filterOption"
          ></a-auto-complete>
        </a-form-item>

        <a-form-item
          v-if="item.type === 'number'"
          :label="item.label"
          :name="item.key"
          :rules="validatorRules[item.key].rules"
        >
          <a-input-number
            :min="1"
            v-model:value="form[item.key]"
            :placeholder="'请输入' + item.label"
          />
        </a-form-item>

        <a-form-item
          v-else-if="item.type === 'select'"
          :label="item.label"
          :name="item.key"
          :rules="validatorRules[item.key].rules"
        >
          <a-select
            v-model:value="form[item.key]"
            :mode="item.mode"
            :placeholder="'请选择' + item.label"
          >
            <a-select-option
              v-for="option of item.options"
              :key="option.value"
              :value="option.value"
              :title="option.text"
            >
              {{ option.text }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          v-else-if="item.type === 'treeSelect'"
          :label="item.label"
          :name="item.key"
          :rules="validatorRules[item.key].rules"
        >
          <a-tree-select
            show-search
            :tree-data="item.options"
            v-model:value="form[item.key]"
            :placeholder="'请选择' + item.label"
            :field-names="{ label: 'name', key: 'id', value: 'id' }"
          >
          </a-tree-select>
        </a-form-item>

        <a-form-item
          v-else-if="item.type === 'datePicker'"
          :label="item.label"
          :name="item.key"
          :rules="validatorRules[item.key].rules"
        >
          <a-date-picker
            valueFormat="YYYY-MM-DD hh:mm:ss"
            v-model:value="form[item.key]"
            show-time
            type="date"
            :placeholder="'请选择' + item.label"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item
          v-else-if="item.type === 'switch'"
          :label="item.label"
          :name="item.key"
          :rules="validatorRules[item.key].rules"
        >
          <a-switch
            v-model:checked="form[item.key]"
            :checked-children="item.options[0]"
            :un-checked-children="item.options[1]"
          />
        </a-form-item>

        <a-form-item
          v-else-if="item.type === 'checkbox'"
          :label="item.label"
          :name="item.key"
          :rules="validatorRules[item.key].rules"
        >
          <a-checkbox-group v-model:value="form[item.key]">
            <a-checkbox
              v-for="option of item.options"
              :key="option.value"
              :name="option.typename"
            >
              {{ option.text }}</a-checkbox
            >
          </a-checkbox-group>
        </a-form-item>

        <a-form-item
          v-else-if="item.type === 'radio'"
          :label="item.label"
          :name="item.key"
          :rules="validatorRules[item.key].rules"
        >
          <a-radio-group v-model:value="form[item.key]">
            <a-radio
              v-for="option of item.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.text }}</a-radio
            >
          </a-radio-group>
        </a-form-item>

        <a-form-item
          v-else-if="item.type === 'textarea'"
          :label="item.label"
          :name="item.key"
          :rules="validatorRules[item.key].rules"
        >
          <a-textarea
            v-model:value="form[item.key]"
            :placeholder="'请输入' + item.label"
          />
        </a-form-item>

        <!-- <a-form-item
          v-else-if="item.type === 'uploadImage'"
          :label="item.label"
        >
          <upload-image
            @upload="upload"
            @removeFile="removeFile"
            :fieldKey="item.key"
            v-decorator="[item.key, validatorRules[item.key]]"
          ></upload-image>
        </a-form-item>

        <a-form-item v-else-if="item.type === 'uploadFile'" :label="item.label">
          <upload-file
            @upload="upload"
            :fieldKey="item.key"
            v-decorator="[item.key, validatorRules[item.key]]"
          ></upload-file>
        </a-form-item> -->
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
      form = state.formObj;
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
