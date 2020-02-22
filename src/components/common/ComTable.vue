<template>
  <div class="widget-table">
    <el-table
      border
      stripe
      :data="list"
      row-key="id"
      :lazy="lazy"
      :load="load"
      @selection-change="listSelect"
      @row-click="listClick"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :default-expand-all="isopen || false"
      style="width:100%"
      :max-height="tableHeight"
    >
      <template slot="empty">
        <label>
          没有符合条件的数据
        </label>
      </template>
      <template v-for="(item, index) in fields">
        <!-- checkbox -->
        <el-table-column
          v-if="item.type === 'selection'"
          :key="'check' + index"
          type="selection"
          :width="item.width ? item.width + 'px' : ''"
          :selectable="selectable"
        ></el-table-column>
        <!-- expand -->
        <el-table-column
          v-else-if="item.type === 'expand' && !item.ismenu"
          type="expand"
          :key="'expand' + index"
        >
          <template slot-scopt="scope">
            <template v-for="(sub, m) in item.props">
              <el-row :key="m">
                <el-col :span="2">{{ sub.label }}</el-col>
                <el-col :span="22" class="moreinfo">{{
                  scope.row[sub.prop]
                }}</el-col>
              </el-row>
              <el-divider
                v-if="m < item.props.length - 1"
                :key="m"
              ></el-divider>
            </template>
          </template>
        </el-table-column>
        <!-- expandTable -->
        <el-table-column
          v-else-if="item.type === 'expandTable'"
          type="expand"
          :key="'expand' + index"
        >
          <template slot-scope="scope">
            <el-table :data="scope.row[item.prop]" :show-header="false">
              <el-table-column
                v-for="(sub, key) in item.fields"
                :key="'expandTableItem' + key"
                :width="sub.width ? sub.width + 'px' : ''"
              >
                <template slot-scope="scopeSub">
                  <template v-if="sub.enum">
                    {{ sub.enum[scopeSub.row[sub.prop]] }}
                  </template>
                  <template v-else>
                    {{ scopeSub.row[sub.prop] }}
                  </template>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <!-- 排序 -->
        <el-table-column
          v-else-if="item.type === 'order'"
          :label="item.label"
          align="center"
          :key="'order' + index"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <i
              class="el-icon-top"
              @click="item.fn('up', scope.$index, scope.row)"
            >
            </i>
            <i
              class="el-icon-bottom"
              @click="item.fn('down', scope.$index, scope.row)"
            >
            </i>
          </template>
        </el-table-column>
        <!-- link -->
        <el-table-column
          v-else-if="item.type === 'link'"
          :label="item.label"
          :key="'link' + index"
          :show-overflow-tooltip="item.tip || false"
          :width="item.width ? item.width + 'px' : ''"
          class-name="link-cell"
        >
          <template slot-scope="scope">
            <el-link
              :underline="false"
              :type="item.style || 'primary'"
              @click="item.fn(scope.row)"
            >
              {{ scope.row[item.prop] }}
            </el-link>
          </template>
        </el-table-column>
        <!-- pics -->
        <el-table-column
          v-else-if="item.type === 'pics'"
          :label="item.label"
          :key="'pics' + index"
          class-name="pics-cell"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <template v-for="(pic, n) in scope.row[item.prop]">
              <el-image
                :key="'img' + n"
                v-if="pic.fileUrl"
                fit="cover"
                :src="pic.fileUrl + $utils.COS_IMG_RULE"
                :preview-src-list="[pic.fileUrl]"
              >
              </el-image>
            </template>
          </template>
        </el-table-column>
        <!-- chat -->
        <el-table-column
          v-else-if="item.type === 'chat'"
          :label="item.label"
          :key="'chat' + index"
          class-name="link-cell"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <template v-if="scope.row[item.prop].type === 'text'">
              {{ scope.row[item.prop].content }}
            </template>
            <template v-if="scope.row[item.prop].type === 'pics'">
              <template v-for="(pic, n) in scope.row[item.prop].content">
                <el-image
                  :key="'img' + n"
                  v-if="pic.fileUrl && scope.row[item.prop].fn"
                  fit="cover"
                  style="width: 40px; height: 40px;cursor: pointer"
                  :src="pic.fileUrl"
                  @click.native="scope.row[item.prop].fn(scope.row)"
                >
                </el-image>
                <el-image
                  v-else-if="pic.fileUrl"
                  :key="'img' + n"
                  fit="cover"
                  style="width: 40px; height: 40px"
                  :src="pic.fileUrl + $utils.COS_IMG_RULE"
                  :preview-src-list="[pic.fileUrl]"
                >
                </el-image>
              </template>
            </template>
            <template v-if="scope.row[item.prop].type === 'share'">
              <el-link
                type="primary"
                :underline="false"
                :href="scope.row[item.prop].content.url"
                target="_blank"
              >
                {{ scope.row[item.prop].content.title }}
              </el-link>
            </template>
            <template v-if="scope.row[item.prop].type === 'file'">
              <el-link
                type="primary"
                :underline="false"
                :href="scope.row[item.prop].content.url"
                target="_blank"
              >
                {{ scope.row[item.prop].content.title }}
              </el-link>
            </template>
            <template v-if="scope.row[item.prop].type === 'audio'">
              <i
                class="el-icon-video-play"
                @click="scope.row[item.prop].fn(scope.row)"
              ></i>
            </template>
            <template v-if="scope.row[item.prop].type === 'video'">
              <el-image
                fit="cover"
                style="width: 40px; height: 40px"
                class="video-cover"
                :src="
                  'data:image/jpeg;base64,' + scope.row[item.prop].content.title
                "
                @click.native="scope.row[item.prop].fn(scope.row)"
              >
              </el-image>
            </template>
            <template v-if="scope.row[item.prop].type === 'unknow'">
              {{ scope.row[item.prop].content }}
            </template>
          </template>
        </el-table-column>
        <!-- icon -->
        <el-table-column
          v-else-if="item.type === 'icon'"
          :label="item.label"
          :key="'icon' + index"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <i
              :class="scope.row[item.prop]"
              @click="listItemClick(item, scope.row)"
            />
          </template>
        </el-table-column>
        <!-- html -->
        <el-table-column
          v-else-if="item.type === 'html'"
          :label="item.label"
          :key="'html' + index"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template slot-scope="scope">
            <div class="html-cell" v-html="scope.row[item.prop]"></div>
          </template>
        </el-table-column>
        <!-- 其他文本类型 -->
        <el-table-column
          v-else
          :key="index"
          :label="item.label"
          :show-overflow-tooltip="item.tip || false"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :width="item.width ? item.width + 'px' : ''"
        >
          <template>
            <template v-if="item.enum">
              {{ item.enum[scope.row[item.prop]] }}
            </template>
            <template v-else>
              {{ scope.row[item.prop] }}
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    selectable: {
      required: false,
      type: Function,
      default() {
        return () => {
          return true;
        };
      }
    }
  },

  methods: {
    name() {}
  }
};
</script>

<style lang="scss" scoped></style>
