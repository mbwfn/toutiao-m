<template>
  <!-- :to="`/article/${article.art_id}`" -->
  <van-cell class="article-item-container" to="/article/7817">
    <!-- 公共新闻简介组件 -->
    <!-- 通过图片数量的不同，来展示不同的结构 -->
    <!-- 标题信息 -->
    <template #title>
      <!-- 使用vant中提供的内置样式来实现两行文本的省略 -->
      <div class="title van-multi-ellipsis--l2">{{ article.title }}</div>
    </template>

    <!-- 底部信息 -->
    <template #label>
      <!-- 更具图片数量进行判断， 如果图片满3张，则显示以下图片展示结构 -->
      <div v-if="article.cover.type === 3" class="cover-wrap">
        <div
          v-for="(img, index) in article.cover.images"
          :key="index"
          class="cover-item"
        >
          <van-image
            class="cover-image"
            fit="cover"
            :src="img"
          />
        </div>
      </div>

      <!-- 底部作者信息 -->
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </template>

    <!-- 右侧图片信息 -->
    <!-- 更具type 的数量来判断有无右侧的内容 当type为1时， 显示以下插槽内容 -->
    <template #default  v-if="article.cover.type === 1">
      <van-image
        class="right-image"
        fit="cover"
        :src="article.cover.images[0]"
      />
    </template>
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.article-item-container {
  .title {
    color: #3a3a3a;
    font-size: 32px;
  }

  .van-cell__value {
    width: 230px;
    height: 146px;
    // 取消右侧盒子的flex布局，这样让横向的剩余部分都留给标题
    flex: unset;
    padding-left: 25px;
    .right-image {
      width: 100%;
      height: 100%;
    }
  }

  .label-info-wrap {
    span {
      font-size: 22px;
      color: #b4b4b4;
      margin-right: 25px;
    }
  }

  .cover-wrap {
    display: flex;
    padding: 30px 0;

    .cover-item {
      // 均分每张图片的宽度
      flex: 1;
      height: 146px;

      &:not(:last-child) {
        // 不会选中最后一个元素
        padding-right: 10px;
      }

      .cover-image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
