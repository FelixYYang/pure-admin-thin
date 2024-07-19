<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { message } from "@/utils/message";
import { ElLoading, FormInstance } from "element-plus";
import { formDataHander } from "@pureadmin/utils";
import { create, update } from "@/api/question";
import { myLoading } from "@/myutils/loading";

const formVisible = defineModel("visible", { type: Boolean });

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const titleMap = { add: "添加题目", update: "更新题目" };
const formTitle = ref("");

const ruleFormRef = ref<FormInstance>();

const formData = ref(props.data);
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const closeDialog = () => {
  formVisible.value = false;
  resetForm(ruleFormRef.value);
};

const emit = defineEmits(["update:visible", "created", "updated"]);

/*watch(
  () => formVisible.value,
  val => {
    emit("update:visible", val);
  }
);*/

/*watch(
  () => visible,
  val => {
    formVisible.value = val.value;
  }
);*/

watch(
  () => props.data,
  val => {
    console.log(val);
    formData.value = Object.assign({}, val);
    if (val.id) {
      formTitle.value = titleMap.update;
      formData.value.options = [...val.options];
    } else {
      formTitle.value = titleMap.add;
      formData.value.options = [{ key: "A", val: "" }];
    }
  }
);

const onDelOption = (index: number) => {
  let options: Array<any> = formData.value.options;
  if (index === options.length - 1 && index != 0) {
    formData.value.options = options.slice(0, index);
  }
};
const onAddOption = () => {
  let options: Array<any> = formData.value.options;
  if (options.length >= 5) {
    message("最多添加5个选项", { type: "error" });
    return;
  }
  let lastOption = options[options.length - 1];
  let codeAt = lastOption.key.charCodeAt(0);
  options.push({ key: String.fromCharCode(codeAt + 1), val: "" });
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (valid) {
      const tmp = formData.value;
      let result: any;
      let loadingIt = myLoading(".dialog-loading");
      try {
        if (tmp.id) {
          result = await update(tmp.id, tmp);
        } else {
          result = await create(tmp);
        }
        console.log(result);
        message("提交成功", { type: "success" });
        formVisible.value = false;
        resetForm(formEl);
        emit("created", result);
      } catch (e) {
        message(e.message, { type: "error" });
      } finally {
        loadingIt.close();
      }
    }
  });
};
</script>

<template>
  <el-dialog
    v-model="formVisible"
    :title="formTitle"
    :width="680"
    draggable
    :before-close="closeDialog"
    custom-class="dialog-loading"
  >
    <!-- 表单内容 -->
    <el-form
      ref="ruleFormRef"
      :model="formData"
      label-width="100px"
      style="margin-right: 80px"
    >
      <el-form-item
        label="题目"
        prop="content"
        :rules="[{ required: true, message: '题目不能为空' }]"
      >
        <el-input
          v-model="formData.content"
          placeholder="请输入题目"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="题型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :value="1">1</el-radio>
          <el-radio :value="2">2/el-radio>
          <el-radio :value="3">3</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选项" />
      <el-form-item
        v-for="(option, index) in formData.options"
        :key="option.key"
        :label="option.key"
        :prop="'options.' + index + '.val'"
        :rules="{
          required: true,
          message: '选项不能为空',
          trigger: 'blur'
        }"
      >
        <div style="display: flex; width: 100%">
          <el-input v-model="option.val" placeholder="请输入选项" />
          <el-button
            v-if="index === formData.options.length - 1"
            class="mt-2"
            style="margin: 0 0 0 5px"
            type="danger"
            @click="onDelOption(index)"
            >删除</el-button
          >
        </div>
      </el-form-item>
      <el-form-item>
        <el-button class="mt-2" type="primary" @click="onAddOption"
          >添加选项</el-button
        >
      </el-form-item>
      <el-form-item label="答案" prop="solution">
        <el-radio-group v-model="formData.solution">
          <el-radio
            v-for="option in formData.options"
            :key="option.key"
            :value="option.key"
            >{{ option.key }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.avatar-uploader .avatar {
  display: block;
  width: 178px;
  height: 178px;
}
</style>

<style>
.avatar-uploader .el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  width: 178px;
  height: 178px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
