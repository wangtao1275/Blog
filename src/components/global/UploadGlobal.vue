<template>
  <div class="page-global">
    <el-upload
      action="/"
      :show-file-list="false"
      :before-upload="uploadBefore"
      :on-remove="delToTXCloud"
      :http-requst="uploadToTXCloud"
      :accept="accept.join(',')"
      :disabled="disabled"
    >
      <template v-if="type === 'card'">
        <el-image v-if="img" :src="img" fit="contain"> </el-image>
        <i v-else class="el-icon-plus upload-icon"></i>
        <div v-if="img" class="update-text">更换图片</div>
      </template>
      <template v-if="type === 'button'">
        <el-button type="primary">
          {{ text }}
        </el-button>
      </template>
      <template v-if="type === 'text'">
        {{ text }}
      </template>
    </el-upload>
  </div>
</template>

<script>
import { delCosImg } from "@/mixins/delCosImg";
export default {
  name: "UploadGlobal",
  mixins: [delCosImg],
  props: {
    img: {
      type: String,
      required: false,
      default() {
        return "";
      }
    },
    size: {
      type: Number,
      required: false,
      default() {
        return 5;
      }
    },
    folder: {
      type: String,
      required: false,
      default() {
        return "/sys/base/";
      }
    },
    type: {
      type: String,
      required: false,
      validator(val) {
        return ["card", "button", "text"].indexOf(val) !== -1;
      },
      default() {
        return "card";
      }
    },
    accept: {
      type: Array,
      required: false,
      default() {
        return ["image/jpeg", "image/png", ".jpeg", ".png"];
      }
    },
    text: {
      type: String,
      required: false,
      default() {
        return "上传";
      }
    },
    isCompress: {
      type: Boolean,
      required: false,
      default() {
        return true;
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      required: false,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      uploadFile: null,
      newImg: ""
    };
  },
  methods: {
    // 图片上传之前对图片大小 和 类型进行验证
    async uploadBefore(file) {
      let isJPG = this.accept.indexOf(file.type) >= 0;
      let isLt2M = file.size < 1024 * 1024 * this.size;
      let formats = [];
      this.accept.forEach(item => {
        if (item.indexOf("/") >= 0) {
          formats.push(item.split("/")[1]);
        }
      });

      if (!isJPG) {
        this.$alert(`上传的文件只能是 ${formats.join("/")} 格式!`);
      }
      if (!isLt2M) {
        this.$alert("上传的文件大小不能超过 " + this.size + "MB!");
      }
      if (isJPG && isLt2M) {
        this.uploadFile = file;
      } else {
        this.uploadFile = null;
      }
      return isJPG && isLt2M;
    },

    // 上传到腾讯云
    async uploadToTXCloud() {
      if (this.uploadFile === null) {
        return;
      }
      await this.getCossign();
      let _this = this;
      let file = this.uploadFile;
      // 拼接文件名称 asdf34yny2834u3428ycbiy49c823.gif
      let fileName = this.$utils.createUUID() + "." + file.type.split("/")[1];
      // 不同菜单上传的路径不一样，所以这里需要父组建传入相应的folder值
      let key = `/resource/img${this.folder}${fileName}`;
      // 视频上传的目录是根目录
      if (this.folder === "/") {
        key = `/${fileName}`;
      }
      if (this.isCompress) {
        // 压缩文件后在进行上传
        this.$utils.compressFile.call(this, file, () => {
          this.put2cos(key, file);
        });
      } else {
        this.put2cos(key, file);
      }
    },
    // 具体上传到腾讯云的方法
    put2cos(key, file) {
      let _this = this;
      // 上传
      this.cos.putObject(
        {
          Bucket: this.sign.bucketName,
          Region: this.sign.regionName,
          Key: key,
          Body: file,
          CacheControl: "no-cache",
          onProgress(progressData) {
            // console.log(progressData)
          }
        },
        function(err, data) {
          if (err) {
            _this.$emit("onerror", err);
          } else {
            // 处理文件信息
            // 处理文件信息
            let cosKeys = data.Location.split("/");
            cosKeys.shift();
            let extensions = data.Location.split(".");
            let fileInfo = {
              name: file.name,
              size: file.size,
              url: window.location.protocol + "//" + data.Location,
              extension: "." + extensions[extensions.length - 1],
              cosKey: "/" + cosKeys.join("/")
            };
            let successData = Object.assign(data, fileInfo);
            _this.newImg = fileInfo.url;

            // 附件上传后，需要添加到媒资表
            // 图片
            let mediaType = 3;
            // pdf
            if (file.type.indexOf("pdf") >= 0) {
              mediaType = 5;
            }
            // 文本
            if (file.type.indexOf("txt") >= 0) {
              mediaType = 4;
            }
            // 视频
            if (file.type.indexOf("mp4") >= 0) {
              mediaType = 1;
            }
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
            _this.$emit("onuploaded", successData);
          }
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped></style>
