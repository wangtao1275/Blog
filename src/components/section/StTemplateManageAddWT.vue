<template>
  <div class="page-bd">
    <el-form label-width="100px" ref="form" :model="form" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="15" class="review-img">
          <el-card shadow="never">
            <div slot="header">预览</div>
            <div class="rule" v-loading="loadingReview">
              <div
                class="rule-top"
                id="rule-top"
                :style="{ width: ruleWidth + 'px' }"
              ></div>
              <div
                class="rule-left"
                id="rule-left"
                :style="{ height: ruleYHeight + 'px' }"
              ></div>
              <div id="template" class="review-bd">
                <div id="tem_inner" class="tem_inner">
                  <img :src="form.templateBg" ref="temImg" />
                  <template
                    v-for="(item, key) in form.pictureTemplateFontModels"
                  >
                    <p
                      :key="key"
                      :style="item.style"
                      v-moveable="{ key, setPosition }"
                      v-html="item.fontTextPre"
                      ref="fontitem"
                      :class="{ textBorder: fontIndex == key }"
                      @click="resetRightPos(key)"
                    ></p>
                  </template>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="9">
          <el-card shadow="never">
            <div slot="header">模板信息</div>
            <el-form-item label="模板名称" prop="templateName">
              <el-input
                maxlength="20"
                v-model="form.templateName"
                placeholder="模板名称(不超过20字符)"
              ></el-input>
            </el-form-item>
            <el-form-item label="模板用途" prop="purpose">
              <el-select placeholder="模板用途" v-model="form.purpose">
                <el-option
                  v-for="(item, key) in enumPurpose"
                  :key="key"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上传背景图" prop="templateBg">
              <upload-global
                class="upload-mini"
                :img="form.templateBg"
                :isCompress="false"
                @onuploaded="uploaded($event, 'templateBg')"
              />
            </el-form-item>
          </el-card>

          <div class="el-card fonts-info" id="fonts-info">
            <el-card
              shadow="never"
              class="font-card"
              v-for="(item, key) in form.pictureTemplateFontModels"
              :key="item.key"
              @click.native="setFontIndex(key)"
            >
              <el-row slot="header">
                <el-col :span="10"></el-col>
                <el-col :span="14" class="text-right">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    v-if="form.pictureTemplateFontModels.length > 1"
                    @click="fontCardDel(key)"
                  ></el-button>
                </el-col>
              </el-row>
              <el-form-item
                class="small-label"
                label="文字"
                :prop="'pictureTemplateFontModels.' + key + '.fontText'"
                :rules="fontsRule[key].fontText"
                :key="key"
              >
                <el-input
                  :rows="3"
                  type="textarea"
                  resize="none"
                  v-model="item.fontText"
                  placeholder="请输入文字内容"
                  @input="listChange"
                ></el-input>
              </el-form-item>
              <el-form-item
                class="small-label"
                label="字体"
                :prop="'pictureTemplateFontModels.' + key + '.fontFamily'"
                :rules="fontsRule[key].fontFamily"
                :key="key"
              >
                <el-select
                  clearable
                  placeholder="请选择字体"
                  @change="fontFamilyChange($event, key)"
                  v-model="item.fontFamily"
                >
                  <el-option
                    v-for="(item, key) in enumFonts"
                    :key="key"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item
                    :key="item.key"
                    class="small-label"
                    label="宽度"
                    :prop="'pictureTemplateFontModels.' + key + '.width'"
                    :rules="fontsRule[key].width"
                  >
                    <el-input
                      placeholder="请输入"
                      maxlength="5"
                      @input="listChange"
                      v-model.number="item.width"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    class="small-label"
                    label="行高"
                    :prop="'pictureTemplateFontModels.' + key + '.lineHeight'"
                    :rules="fontsRule[key].lineHeight"
                  >
                    <el-input
                      placeholder="请输入行高"
                      @input="listChange"
                      v-model.number="item.lineHeight"
                      maxlength="5"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item
                    :key="item.key"
                    class="small-label"
                    label="X坐标"
                    :prop="'pictureTemplateFontModels.' + key + '.positionX'"
                    :rules="fontsRule[key].positionX"
                  >
                    <el-input
                      placeholder="请输入"
                      maxlength="5"
                      @input="listChange"
                      v-model.number="item.positionX"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :key="item.key"
                    class="small-label"
                    label="Y坐标"
                    :prop="'pictureTemplateFontModels.' + key + '.positionY'"
                    :rules="fontsRule[key].positionY"
                  >
                    <el-input
                      placeholder="请输入"
                      maxlength="5"
                      @input="listChange"
                      v-model.number="item.positionY"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item
                class="small-label"
                label="方向"
                :prop="'pictureTemplateFontModels.' + key + '.textAlign'"
              >
                <el-radio-group v-model="item.textAlign" @change="listChange">
                  <el-radio-button :label="1">左</el-radio-button>
                  <el-radio-button :label="2">中</el-radio-button>
                  <el-radio-button :label="3">右</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                class="small-label"
                label="字号"
                :prop="'pictureTemplateFontModels.' + key + '.fontSize'"
                :rules="fontsRule[key].fontSize"
              >
                <el-input
                  placeholder="请输入字号"
                  @input="listChange"
                  v-model.number="item.fontSize"
                  maxlength="3"
                >
                  <template slot="append">
                    PX
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item
                class="small-label form-color-item"
                label="颜色"
                :prop="'pictureTemplateFontModels.' + key + '.color'"
                :rules="fontsRule[key].color"
              >
                <el-input
                  placeholder="请选择或者输入颜色"
                  maxlength="7"
                  v-model="item.color"
                  @input="listChange"
                >
                  <template slot="append">
                    <el-color-picker
                      v-model="item.color"
                      @change="listChange"
                    ></el-color-picker>
                  </template>
                </el-input>
              </el-form-item>
            </el-card>
          </div>
        </el-col>
      </el-row>

      <!-- submit -->
      <el-row class="text-center">
        <el-button @click="fontCardAdd">添加文字内容</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Ruler from '@/plugins/ruler';
import { Loading } from 'element-ui';
import html2canvas from 'html2canvas';
export default {
  data() {
    return {
      form: {
        templateName: null,
        purpose: 1,
        templateBg: null,
        template: null,
        imgSize: null,
        pictureTemplateFontModels: [
          {
            key: Date.now(),
            fontText: null,
            fontFamily: 'zzgfYueYuanTi',
            width: 0,
            height: 0,
            lineHeight: 30,
            textAlign: 1,
            positionX: 10,
            positionY: 10,
            fontSize: 30,
            color: '#000000'
          }
        ]
      },
      rules: {
        templateName: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        purpose: [
          { required: true, message: '请选择用途', trigger: ['change', 'blur'] }
        ],
        templateBg: [
          {
            required: true,
            message: '请上传背景图',
            trigger: ['change', 'blur']
          }
        ]
      },
      fontsRule: [],
      fontsRuleItem: {
        fontText: [
          {
            required: true,
            message: '请输入文字内容',
            trigger: ['blur', 'change']
          },
          {
            type: 'string',
            max: 300,
            message: '最多可输入300个字',
            trigger: ['blur', 'change']
          }
        ],
        fontFamily: {
          required: true,
          message: '请选择字体',
          trigger: ['blur', 'change']
        },
        width: [
          {
            required: true,
            message: '请输入宽度',
            trigger: ['blur', 'change']
          },
          {
            type: 'number',
            pattern: /^[0-9]{1,5}$/,
            message: '宽度格式错误',
            trigger: ['blur', 'change']
          },
          {
            type: 'number',
            max: 10000,
            message: '最大值为10000',
            trigger: ['blur', 'change']
          }
        ],
        lineHeight: [
          {
            required: true,
            message: '请输入行高',
            trigger: ['blur', 'change']
          },
          {
            type: 'number',
            pattern: /^[0-9]{1,5}$/,
            message: '行高格式错误',
            trigger: ['blur', 'change']
          },
          {
            type: 'number',
            max: 10000,
            message: '最大值为10000',
            trigger: ['blur', 'change']
          }
        ],
        positionX: [
          {
            required: true,
            message: '请输入X坐标',
            trigger: ['blur', 'change']
          },
          {
            type: 'number',
            pattern: /^[0-9]{1,5}$/,
            message: '坐标格式错误',
            trigger: ['blur', 'change']
          },
          {
            type: 'number',
            max: 10000,
            message: '最大值为10000',
            trigger: ['blur', 'change']
          }
        ],
        positionY: [
          {
            required: true,
            message: '请输入Y坐标',
            trigger: ['blur', 'change']
          },
          {
            type: 'number',
            pattern: /^[0-9]{1,5}$/,
            message: '坐标格式错误',
            trigger: ['blur', 'change']
          },
          {
            type: 'number',
            max: 10000,
            message: '最大值为10000',
            trigger: ['blur', 'change']
          }
        ],
        fontSize: [
          {
            required: true,
            type: 'number',
            message: '请输入字号',
            trigger: ['blur', 'change']
          },
          {
            type: 'number',
            pattern: /^[1-9]([0-9]{1,2})?$/,
            message: '字号格式错误',
            trigger: ['blur', 'change']
          },
          {
            type: 'number',
            min: 1,
            max: 999,
            message: '字号最大为999',
            trigger: ['blur', 'change']
          }
        ],
        color: [
          {
            required: true,
            message: '请选择或者输入颜色',
            trigger: ['blur', 'change']
          },
          {
            pattern: /^#[0-9a-f]{6}$/i,
            message: '颜色格式错误',
            trigger: ['blur', 'change']
          }
        ]
      },
      enumPurpose: [],
      enumFonts: [],
      loading: null,
      loadingReview: false,
      ruleXWidth: 1920,
      ruleYHeight: 1920,
      ruleX: null,
      ruleY: null,
      ruleXLeft: 0,
      ruleYTop: 0,
      fontIndex: 0
    };
  },
  created() {
    this.fontsRule.push(JSON.parse(JSON.stringify(this.fontsRuleItem)));
  },
  mounted() {
    this.getParams();
    this.getEnum();
    this.getShowInfo();
  },
  methods: {
    // 设置标尺
    setRuler() {
      let width = this.ruleXWidth;
      let height = this.ruleYHeight;
      this.ruleX = new Ruler({
        el: 'rule-top',
        width,
        height: 20
      }).run();
      this.ruleY = new Ruler({
        el: 'rule-left',
        type: 'y',
        width: 20,
        height
      }).run();
    },

    // 设置当前改变的文字索引值
    setFontIndex(key) {
      this.fontIndex = key;
      this.setMaxXY();
    },

    // 文字内容 删除
    fontCardDel(index) {
      this.form.pictureTemplateFontModels.slice(index, 1);
      this.form.pictureTemplateFontModels.forEach(item => {
        item.key = Date.now();
      });
      this.listChange();

      this.fontsRule.splice(index, 1);
    },

    // 字体加载事件
    fontFamilyChange(fontFamily, index) {
      this.listChange();

      // 加载中
      document.fonts.onloading = () => {
        this.loadingReview = true;
      };

      // 加载结束
      document.fonts.onloadingdone = () => {
        this.loadingReview = false;
      };
    },

    // 点击左侧文字，自动定位右侧位置
    resetRightPos(key) {
      let ele = document.querySelector('#fonts-info .el-card');
      document.querySelector('#fonts-info').scrollTop = ele.offsetHeight * key;
      this.fontIndex = key;
    },

    getParams() {
      let { type, id } = this.$route.params;
      this.id = id;
      this.type = type;
    },
    async getEnum() {
      let res = await this.$request.common.enum({
        codeLists: ['700013']
      });
      if (res.success) {
        // 用途
        this.enumPurpose = res.result.purpose;
        // 字体库
        this.enumFonts = this.$utils.fontLib();
      }
    },
    async getShowInfo() {
      if (this.id == 0) {
        return;
      }
      let res = await this.$request.template.show({ id: this.id });
      if (res.success) {
        this.form = res.result;
        this.fontsRule = [];
        res.result.pictureTemplateFontVoList.forEach(item => {
          this.fontsRule.push(JSON.parse(JSON.stringify(this.fontsRuleItem)));
        });
        this.form.pictureTemplateFontModels = this.form.pictureTemplateFontVoList;
        this.listChange();
      }
    },

    // 列表改变事件
    listChange() {
      let val = this.form.pictureTemplateFontModels;
      val.map((item, index) => {
        item.style = {
          left: item.positionX + 'px',
          top: item.positionY + 'px',
          color: item.color,
          'z-index': index + 1,
          'font-family': item.fontFamily,
          'font-size': item.fontSize + 'px',
          'text-align': ['left', 'center', 'right'][item.textAlign - 1]
        };
        (item.width || item.width == 0) &&
          (item.style.width = item.width + 'px');
        item.height && (item.style.height = item.height + 'px');
        item.lineHeight && (item.style['line-height'] = item.lineHeight + 'px');

        item.fontTextPre = (item.fontText || '').replace(/\n/g, '<br>');
        item.fontTextPre = (item.fontTextPre || '').replace(/\s/g, '&nbsp;');

        return item;
      });
      this.$forceUpdate();
      this.setMaxXY();
    },

    // 文字内容 添加
    fontCardAdd() {
      this.form.pictureTemplateFontModels.push({
        key: Date.now(),
        fontText: null,
        fontFamily: null,
        width: 0,
        height: 0,
        lineHeight: 30,
        textAlign: 1,
        positionX: 10,
        positionY: 10,
        fontSize: 30,
        color: '#000000'
      });
      this.listChange();
      this.fontsRule.push(JSON.parse(JSON.stringify(this.fontsRuleItem)));
    },

    // 创建图片
    async createImg() {
      this.loading = Loading.service();

      let oTemplate = document.getElementById('tem_inner'),
        width = parseInt(oTemplate.offsetWidth),
        height = parseInt(oTemplate.offsetHeight),
        scale = 1;

      let canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      canvas.style.width = width * scale + 'px';
      canvas.style.height = height * scale + 'px';

      let res = await html2canvas(oTemplate, {
        allowTaint: true,
        canvas: canvas,
        useCORS: true,
        scale: scale,
        width: width,
        height: height,
        loading: false
      });
      return res;
    },

    // 将base64转换为文件对象
    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },

    async submitData() {
      let index = this.id == 0 ? 0 : 1;
      let data = JSON.parse(JSON.stringify(this.form));
      delete data.pictureTemplateFontVoList;
      delete data.templateStatus;
      data.pictureTemplateFontModels = data.pictureTemplateFontModels.map(
        item => {
          item.id && (item.fontId = item.id);
          delete item.style;
          delete item.id;
          delete item.fontTextPre;
          delete item.key;
          delete item.createdAt;
          delete item.deleted;
          delete item.updatedAt;
          return item;
        }
      );
      let res = await this.$request.template[['add', 'edit'][index]](data);
      if (res.success) {
        this.$notify.success({
          title: '提示',
          message: '操作成功!'
        });
        this.loading.close();
        this.loading = null;
        this.$router.back(-1);
      }
    },

    // 上传图片
    async uploadFile(compressFile) {
      await this.getCossign();
      let _this = this;

      // 拼接文件名称 asdf34yny2834u3428ycbiy49c823.gif
      // 添加时间戳的意义在于防止IE缓存；比如编辑的时候更换了图片，但是列表没有更换
      let fileName = this.$utils.createUUID() + '.jpeg';
      let key = `/resource/img/sys/base/${fileName}`;
      let opts = {
        Bucket: _this.sign.bucketName,
        Region: _this.sign.regionName,
        Key: key,
        Body: compressFile,
        onProgress(progressData) {
          // console.log(progressData)
        }
      };
      _this.cos.putObject(opts, function(err, data) {
        if (err) {
          _this.$emit('onerror', err);
          return;
        }
        // 处理文件信息
        let cosKeys = data.Location.split('/');
        cosKeys.shift();
        let extensions = data.Location.split('.');
        let fileInfo = {
          name: _this.form.templateName,
          size: compressFile.size,
          url: window.location.protocol + '//' + data.Location,
          extension: '.' + extensions[extensions.length - 1],
          cosKey: '/' + cosKeys.join('/')
        };
        let successData = Object.assign(data, fileInfo);
        // console.log(successData);
        // 给form赋值
        _this.form.template = fileInfo.url;
        _this.form.imgSize = fileInfo.size;
        _this.submitData();
        // 图片
        let mediaType = 3;
        // 这块不确定是否成功，也不需要验证，所以try起来
        try {
          _this.$request.common.insertMedia({
            url: fileInfo.url,
            mediaType: mediaType,
            mediaSize: fileInfo.size
          });
        } catch (error) {
          // error
        }
      });
    },

    // 保存预览图
    async saveReviewImg() {
      let _this = this;
      // 创建图片
      let res = await this.createImg();
      let scale = 1;
      let context = res.getContext('2d');
      context.fillStyle = 'rgba(255, 255, 255, 0)';
      context.scale(scale, scale);
      let file = res.toDataURL('image/jpeg');

      // 拿到blob文件
      let blobFile = this.dataURLtoFile(file, '111');

      // 压缩文件后在进行上传
      // _this.$utils.compressFile.call(_this, blobFile, compressFile => {
      // 上传
      this.uploadFile(blobFile);
      // });
    },

    // 提交
    submit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        this.fontIndex = -1;
        this.$nextTick(() => {
          this.saveReviewImg();
        });
      });
    },

    // 设置最大x轴y轴
    setMaxXY() {
      setTimeout(() => {
        let oTem = document.getElementById('tem_inner');
        let innerFonts = oTem.querySelectorAll('p');

        if (!innerFonts.length) {
          return;
        }
        let maxW = oTem.offsetWidth;
        innerFonts.forEach((item, index) => {
          let maxX = this.ruleXWidth - item.offsetWidth;
          let maxY = this.ruleYHeight - item.scrollHeight;
          this.fontsRule[index].width[2].max = maxW;
          this.fontsRule[index].width[2].message = '最大值为' + maxW;
          this.fontsRule[index].positionX[2].max = maxX < 0 ? 0 : maxX;
          this.fontsRule[index].positionX[2].message =
            '最大值为' + (maxX < 0 ? 0 : maxX);
          this.fontsRule[index].positionY[2].max = maxY < 0 ? 0 : maxY;
          this.fontsRule[index].positionY[2].message =
            '最大值为' + (maxY < 0 ? 0 : maxY);
        });
        this.$refs.form.validateField(
          'pictureTemplateFontModels.' + this.fontIndex + '.positionX'
        );
        this.$refs.form.validateField(
          'pictureTemplateFontModels.' + this.fontIndex + '.positionY'
        );
      }, 30);
    }
  },
  watch: {
    'form.templateBg'(val) {
      let img = new Image();
      img.src = val;
      img.onload = () => {
        let oTemInner = document.getElementById('item_inner');
        oTemInner.style.width = img.width + 'px';
        oTemInner.style.height = img.height + 'px';
        this.ruleXWidth = img.width;
        this.ruleYHeight = img.height;
        this.setMaxXY();
        this.setRuler();

        let oTem = document.getElementById('template');
        let ruleX = document.querySelector('#rule-top canvas');
        let ruleY = document.querySelector('#rule-left canvas');
        oTem.onscroll = () => {
          ruleX.style.marginLeft = -oTem.scrollLeft + 'px';
          ruleY.style.marginTop = -oTem.scrollTop + 'px';
        };
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 20px;
  /deep/ .el-card__body {
    padding-bottom: 0;
  }
}
.el-select {
  width: 100%;
}
.font-card /deep/ {
  .el-card__header {
    padding: 5px 20px;
    line-height: 30px;
  }
  .el-card__header .el-button {
    padding: 4px;
    font-size: 16px;
  }
}
.review-img /deep/ .el-card__body {
  padding-bottom: 20px;
}

.small-label /deep/ {
  .el-form-item__label {
    width: 60px !important;
  }
  .el-form-item__content {
    margin-left: 60px !important;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    padding: 0 15px;
  }
  .el-row .el-col:first-child {
    padding-left: 0 !important;
  }
}

.form-color-item /deep/ {
  .el-input-group__append {
    padding: 0;
  }
  .el-color-picker--small {
    height: 30px;
  }
  .el-color-picker--small .el-color-picker__trigger {
    width: 47px;
    height: 30px;
    padding: 0;
    border: 0;
    vertical-align: top;
  }
  .el-color-picker__color {
    border: 0;
  }
}

.el-form /deep/ {
  .review-img {
    min-width: 625px;
  }
  .rule {
    position: relative;
    height: 720px;
    padding: 20px 0 0 20px;
    overflow: hidden;
    .rule-top,
    .rule-left {
      position: absolute;
      left: 0;
      top: 0;
      overflow: hidden;
    }
    .rule-top {
      top: 0;
      left: 20px;
      height: 20px;
      canvas {
        transform: translate(-25%, -25%) scale(0.5);
      }
    }
    .rule-left {
      top: 20px;
      bottom: 0;
      width: 20px;
      canvas {
        transform: translate(-25%, -25%) scale(0.5);
      }
    }
  }
  .review-img .review-bd {
    width: 100%;
    max-height: 700px;
    min-height: 100px;
    overflow: auto;
  }
  .review-img .tem_inner {
    background: rgba(255, 255, 255, 0);
    position: relative;
    overflow: hidden;
  }
  .review-img img {
    position: absolute;
    left: 0;
    top: 0;
  }
  .review-img p {
    position: absolute;
    z-index: 2;
    margin: 0;
    box-sizing: border-box;
    border: 1px dashed transparent;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-line;

    &:hover {
      cursor: move;
    }
  }
  .review-img .textBorder {
    border-color: $--color-primary;
  }
  .fonts-info {
    height: 470px;
    padding: 20px 20px 0;
    overflow: auto;
  }
}
</style>
