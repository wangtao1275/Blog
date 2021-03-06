<template>
  <div class="page-search" id="tableSearch">
    <el-form
      inline
      :label-width="labelWidth"
      :model="search"
      :disabled="isDisable"
    >
      <el-row v-for="(row, index) in action" :key="index">
        <el-form-item
          v-for="(col, subIndex) in row"
          :key="subIndex"
          :label="col.label"
          :class="{ 'el-form-item__larger': col.size == 'lager' }"
        >
          <template v-if="!col.type || col.type === 'input'">
            <el-input
              :clearable="!isDisable"
              :placeholder="col.placeholder || '请输入' + col.label"
              :key="subIndex"
              :maxlength="col.maxlength"
              v-model="search[col.name]"
            >
            </el-input>
          </template>
          <template v-if="col.type === 'number'">
            <el-input
              :clearable="!isDisable"
              :placeholder="col.placeholder || '请输入' + col.label"
              :key="subIndex"
              :maxlength="col.maxlength"
              v-model="search[col.name]"
              @input="verifyID($event, col)"
            >
            </el-input>
          </template>
          <template v-if="col.type === 'textarea'">
            <el-input
              :clearable="!isDisable"
              resize="none"
              :placeholder="col.placeholder || '请输入' + col.label"
              :key="subIndex"
              :maxlength="col.maxlength"
              v-model="search[col.name]"
              type="textarea"
              :rows="3"
            >
            </el-input>
          </template>
          <template v-if="col.type === 'select'">
            <el-select
              :placeholder="col.placeholder || '请选择' + col.label"
              :key="subIndex"
              :maxlength="col.maxlength"
              @change="selectChange($event, col)"
            >
              <el-option
                v-if="col.optionAll != 'hide'"
                label="全部"
                value="-999"
              >
              </el-option>
              <el-option
                v-for="(opt, o) in col.options"
                :key="o"
                :label="opt.name"
                :value="opt.value"
              >
              </el-option>
            </el-select>
          </template>
          <template v-if="col.type === 'cascader'">
            <el-cascader
              :placeholder="col.placeholder || '请选择' + col.label"
              :key="subIndex"
              v-model="search[col.name]"
              :props="col.props"
              clearable
            >
            </el-cascader>
          </template>
          <template v-if="col.type === 'daterange'">
            <el-date-picker
              :key="subIndex"
              v-model="search[col.name]"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="daterangeOpt"
              :props="col.props"
              clearable
            >
            </el-date-picker>
          </template>
          <template v-if="col.type === 'date'">
            <el-date-picker
              :key="subIndex"
              v-model="search[col.name]"
              type="date"
              value-format="yyyy-MM-dd"
              :picker-options="daterangeOpt"
              :placeholder="col.placeholder || '请选择' + col.label"
            >
            </el-date-picker>
          </template>
          <template v-if="col.type === 'button'">
            <el-button
              :key="subIndex"
              :type="col.style ? col.style : ''"
              @click="btnClick(col)"
              >{{ col.text }}
            </el-button>
          </template>
          <template v-if="col.type === 'image'">
            <el-popover trigger="hover">
              <img
                :src="search[col.name]"
                style="max-width:400px; max-height:300px;"
              />
              <el-image
                fit="cover"
                style="width: 32px; height: 32px"
                :src="search[col.name]"
                slot="reference"
              >
              </el-image>
            </el-popover>
          </template>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import QRCode from 'qrcode';
export default {
  name: "ComPageSearch",
  props: {
    action: {
      required: true,
      type: Array,
      default: function() {
        return {};
      }
    },
    // 是否禁用当前所有检索条件
    isDisable: {
      required: false,
      type: Boolean,
      default() {
        return false;
      }
    },
    // label宽度
    labelWidth: {
      required: false,
      type: String,
      default() {
        return "80px";
      }
    },
    // 是否处理大于当前日期的限制
    dateCheck: {
      required: false,
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      daterangeOpt: {},
      search: {},
      qrcode: ""
    };
  },
  mounted() {
    this.handlerDate();
  },
  methods: {
    handlerDate() {
      if (this.dateCheck) {
        this.daterangeOpt.disableDate = function(date) {
          return new Date(date).getTime() > new Date().getTime();
        };
      } else {
        this.daterangeOpt.disabledDate = function() {
          return false;
        };
      }
    },
    // 按钮点击事件，把数据传回去
    btnClick(item) {
      if (item.action === "clear") {
        this.action.forEach(row => {
          row.forEach(col => {
            if (col.name) {
              this.$set(
                this.search,
                col.name,
                col.value !== null
                  ? typeof col.value === "string"
                    ? col.value.trim()
                    : col.value
                  : null
              );
            }
          });
        });
      }
      item.fn(this.search);
    },
    // 下拉框改变事件
    selectChange($event, col) {
      col.fn && col.fn($event);
    },
    // input 改变事件
    verifyID(val, col) {
      col.fn && col.fn(val, col);
      // eslint-disable-next-line
      let newVal = val.replace(/^0|[^\d+]|[`,\.eE\-\+]/g, "");
      this.search[col.name] = newVal;
      this.$set(this.search, col.name, newVal);
    }
  },
  watch: {
    // 监听一下search，在改变的时候回传出去
    search: {
      handler: function(val, oldVal) {
        this.$emit("onchange", val);
      },
      deep: true
    },
    action: {
      handler(val, old) {
        val.forEach(row => {
          row.forEach(col => {
            if (col.name) {
              this.$set(
                this.search,
                col.name,
                col.value !== null ? col.value : null
              );
            }
            if (col.type === "qrcode" && col.value) {
              QRCode.toDataURL(col.value).then(url => {
                this.qrcode = url;
              });
            }
          });
        });
        this.$emit("oninit", this.search);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form /deep/ {
  .el-input,
  .el-select,
  .el-date-editor--daterange.el-input__inner {
    width: 220px;
  }
  .el-image__error {
    line-height: 1;
  }
  .el-form-item__larger .el-form-item__content {
    width: 447px;
    .el-input {
      width: 100%;
    }
  }
}
</style>
