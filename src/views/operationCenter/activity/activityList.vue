<template>
  <div class="page-admin">
    <!-- page header -->
    <com-page-header></com-page-header>
    <el-row class="page-bg">
      <!-- page action -->
      <com-page-search :action="pageAction"></com-page-search>

      <!-- page list -->
      <com-table
        :list="list"
        :total="totalCount"
        :fields="fields"
        :actions="actions"
        :currPage="pageNo"
        actionWidth="120px"
        @onpage="onpage"
        @onsize="onsize"
      ></com-table>
    </el-row>
  </div>
</template>

<script>
import ComPageHeader from '@/components/common/ComPageHeader';
import ComPageSearch from '@/components/common/ComPageSearch';
import ComTable from '@/components/common/ComTable';
import { listCommon } from '@/mixins/listCommon';
import { listEdit } from '@/mixins/listEdit';
export default {
  name: "activityList",
  mixins: [listCommon, listEdit],
  components: {
    ComPageHeader,
    ComPageSearch,
    ComTable
  },
  data() {
    return {
      // 查询字段
      pageAction: [
        { label: "活动名称", name: "activityName" },
        { label: "活动开始时间", name: "beginDate", type: "date" },
        {
          label: "活动赛道",
          name: "channelCode",
          type: "select",
          options: [],
          value: "-999"
        },
        { type: "button", text: "查询", style: "primary", fn: this.onsearch },
        { type: "button", text: "清除", action: "clear", fn: this.clearSearch },
        { type: "button", text: "创建活动", fn: this.createActive }
      ],
      //表格字段
      fields: [
        { label: "活动名称", prop: "activityName", tip: true },
        { label: "活动赛道", prop: "channelName" },
        { label: "开始时间", prop: "beginDate" },
        { label: "创建时间", prop: "createdAt" }
      ],
      //表格操作
      actions: [
        {
          text: "编辑",
          fn: this.showEdit
        },
        {
          text: "删除",
          fn: this.showEdit
        },
        {
          text: "禁止",
          fn: this.prohit,
          trigger: { field: "isDisabled", value: 0 }
        },
        {
          text: "解禁",
          fn: this.prohit,
          trigger: { field: "isDisabled", value: 1 }
        },
        {
          text: "课程管理",
          fn: this.courseManagement
        }
      ],
      batActions: [
        { text: '批量停用', fn: this.listBatDisable },
        { text: '批量启用', fn: this.listBatEnable }
      ],
      apiName: "activity",
      channelList: []
    };
  },
  mounted() {
    this.getEnum();
    this.getList();
  },
  methods: {
    // 处理查询条件
    listCondition(data) {
      data.condition = { ...data };
      //
      if (data.daterange && data.daterange.length) {
        data.condition.updatedAtStart = data.daterange[0];
        data.condition.updatedAtEnd = data.daterange[1];
        delete data.condition.daterange;
      }
      data.condition = this.$utils.formatParams(data.condition);
      delete data.condition.pageNo;
      delete data.condition.pageSize;
      Object.keys(data).forEach(item => {
        if (["condition", "pageNo", "pageSize"].indexOf(item) < 0) {
          delete data[item];
        }
      });
    },
    // 处理返回结果
    listItem(item, name) {
      if (item.imgResource.length) {
        item.img = [{ fileUrl: item.imgResource[0].imgUrl }];
        item.url = item.imgResource[0].url;
      } else {
        item.img = [{ fileUrl: "" }];
        item.url = "";
      }
      item.icon = item.isDefault
        ? "el-link el-link--success el-icon-success"
        : "el-link el-link--danger el-icon-circle-close";
      item.isIosAdoptText = item.isIosAdopt ? "通过" : "未通过";
      item.isUpperShelfText = ["否", "是"][item.isUpperShelf];

      if (item[name] == -1) {
        item[name] = "";
      }
    },
    // 禁止/解禁
    prohit(row) {
      const data = { id: row.id, isDisabled: row.isDisabled === 0 ? 1 : 0 };
      this.$request.activity.prohibit(data).then(res => {
        if (res.success) {
          this.$notify.success({
            title: "提示",
            message: "操作成功！"
          });
          this.getList();
        } else {
          this.$notify.error({
            title: "提示",
            message: res.message
          });
        }
      });
    },
    //课程管理
    courseManagement(row) {
      this.$router.push({
        path: "/activity/detail/" + row.id
        // query: { baseInfo: JSON.stringify({ ... row })}
      });
    },
    // 编辑
    listEdit(row) {
      this.$router.push({
        path: "/activity/edit/" + row.id
      });
    },
    // 删除
    listDelAction(row) {
      this.listDel({ id: row.id, beginDate: row.beginDate });
    },

    // 获取枚举数据
    async getEnum() {
      let res = await this.$request.common.enum({
        codeLists: ["100001"]
      });
      if (res.success) {
        let listEnumChannel = res.result.channel.filter(
          item => item.value !== 0
        );
        this.channelList = listEnumChannel;
        this.$set(this.pageAction[0][3], "options", this.channelList);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
