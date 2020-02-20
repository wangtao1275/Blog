/**
 *xxx-xxY管理
 *
 * @export
 * @param {*} fetch
 * @returns
 */
export default function xxxY(fetch) {
  return {
    // 列表
    list(data) {
      return fetch(`/api/xxx/list/select-list.json`, data, "POST");
    },
    // 添加
    add(data) {
      return fetch(`/api/xxx/edit/create.json`, data, "POST");
    },
    // 编辑
    edit(data) {
      return fetch("/api/xxx/edit/update.json", data, "POST");
    },
    // 详细
    show(data) {
      return fetch("/api/xxx/edit/edit.json", data, "POST");
    },
    // 删除
    del(data) {
      return fetch("/api/xxx/delete-xxx.json", data, "POST");
    },
    // 批量删除
    delBat(data) {
      return fetch("/api/xxx/delete-list.json", data, "GET");
    }
  };
}
