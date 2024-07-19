import { ElLoading } from "element-plus";

export function myLoading(target: string | HTMLElement) {
  return ElLoading.service({
    target: target,
    lock: true,
    text: "拼命加载中",
    background: "rgba(0, 0, 0, 0.7)"
  });
}
