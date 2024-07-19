<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import AddFill from "@iconify-icons/ri/add-circle-line";
import EPEdit from "@iconify-icons/ep/edit";
import EPDelete from "@iconify-icons/ep/delete-filled";
import { getList, destroy } from "@/api/question";
import DialogForm from "@/views/question/components/DialogForm.vue";
import { ElMessageBox } from "element-plus";
import { message } from "@/utils/message";

const listQuery = reactive({
  page: 1,
  limit: 10,
  search: ""
});
const total = ref(0);
const listSizeChange = val => {
  listQuery.limit = val;
  getData();
};
const listPageChange = val => {
  listQuery.page = val;
  getData();
};
const tableData = ref([]);
const loading = ref(false);
const getData = async () => {
  loading.value = true;
  try {
    let data = await getList(listQuery);
    tableData.value = data.data;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getData();
});
const INITIAL_DATA = {
  type: 1,
  content: "",
  options: {},
  solution: "A"
};
const formDialogVisible = ref(false);
const formData = ref({ ...INITIAL_DATA });
const searchValue = ref("");
const resetFormData = () => {
  formData.value = { ...INITIAL_DATA };
};
const onItCreated = it => {
  getData();
};
const toEdit = (it: any) => {
  formDialogVisible.value = true;
  nextTick(() => {
    formData.value = { ...it };
  });
};
const handleDel = (item: any) => {
  ElMessageBox.confirm(
    item ? `确认删除后${item.content}所有信息将被清空, 且无法恢复` : "",
    "提示",
    {
      type: "warning"
    }
  )
    .then(async () => {
      let result = await destroy(item.id);
      message("删除成功", { type: "success" });
      await getData();
    })
    .catch(() => {});
};
const typeMap = {
  1: "1",
  2: "2",
  3: "3"
};
</script>

<template>
  <el-card v-loading="loading" shadow="never">
    <div class="w-full flex justify-between mb-4">
      <el-button
        :icon="useRenderIcon(AddFill)"
        @click="
          formDialogVisible = true;
          resetFormData();
        "
      >
        新建题目
      </el-button>
      <el-input
        v-model="listQuery.search"
        style="width: 300px"
        placeholder="请输入题目关键字"
        clearable
        @keyup.enter="getData"
      >
        <template #suffix>
          <el-icon class="el-input__icon">
            <IconifyIconOffline
              v-show="searchValue.length === 0"
              icon="ri:search-line"
            />
          </el-icon>
        </template>
      </el-input>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column label="题型" prop="type">
        <template #default="scope">
          {{ typeMap[scope.row.type] ? typeMap[scope.row.type] : "" }}
        </template>
      </el-table-column>
      <el-table-column prop="content" label="题目" />
      <el-table-column prop="solution" label="正确答案" width="100" />
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column label="操作" width="210" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            :icon="useRenderIcon(EPEdit)"
            @click="toEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            :icon="useRenderIcon(EPDelete)"
            @click="handleDel(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 15, 20, 50]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="listSizeChange"
      @current-change="listPageChange"
    />
    <dialog-form
      v-model:visible="formDialogVisible"
      :data="formData"
      @created="onItCreated"
      @updated="onItCreated"
    />
  </el-card>
</template>
