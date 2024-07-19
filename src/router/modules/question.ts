export default {
  path: "/questions",
  redirect: "/questions/index",
  meta: {
    icon: "ep:scale-to-original",
    title: "题库管理",
    rank: 0
  },
  children: [
    {
      path: "/questions/index",
      name: "Questions",
      component: () => import("@/views/question/index.vue"),
      meta: {
        title: "题库管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
