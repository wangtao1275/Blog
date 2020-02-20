export const listCommon = {
  data() {
    return {
      pageAction: [],
      fields: [],
      actions: [
        { text: "编辑", fn: this.listEdit },
        { text: "删除", fn: this.listDelAction }
      ],
      search: {},
      pageNo: 1,
      pageSize: 10,
      list: [],
      totalCount: 0
    };
  },
  methods: {
    async getList() {
      let data = JSON.parse(JSON.stringify(this.search));
      data.pageNo = this.pageNo;
      data.pageSize = this.pageSize;
      this.listCondition && this.listCondition(data);
      data = this.$utils.formatParams(data);
      let res = await this.$request[this.apiName].list(data).catch(e => {
        this.listCatch && this.listCatch(e);
        return { success: false };
      });
      if (res.success) {
        let total =
          (res.pageInfo && res.pageInfo.totalCount) ||
          (res.result &&
            res.result.pageInfo &&
            res.result.pageInfo.totalCount) ||
          (res.result && res.result.total) ||
          0;

        this.totalCount = total;
        let list = res.result ? res.result[this.listName] || [] : [];
        if (!this.listName || this.listName === "") {
          list = res.result || [];
        }
        if (!list.length) {
          if (this.pageNo > 1) {
            this.pageNo -= 1;
            this.getList();
          }
        }
        this.list = list.map((item, index) => {
          item.index = index + 1;
          this.listItem && this.listItem(item);
          return item;
        });
      }
    },
    onsearch(form) {
      this.search = form;
      this.pageNo = 1;
      this.getList();
    },
    clearSearch() {
      this.onsearch({});
    },
    onpage(pageNo) {
      this.pageNo = pageNo;
      this.getList();
    },
    onsize(size) {
      this.pageNo = 1;
      this.pageSize = size;
      this.getList();
    }
  }
};
