<template>
  <div class="content">
    <swiper :options="swiperOption">
      <swiper-slide v-for="(item, index) in list" :key="index"></swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
export default {
  name: "vueswiperdemo",
  data() {
    return {
      list: [],
      swiperOption: {
        watchSlidesProgress: true,
        slidesPerView: "auto",
        centeredSlides: true,
        onProgress: function (swiper, progress) {
          let slidesLen = swiper.slides.length;
          for (let i = 0; i < slidesLen; i++) {
            let slide = swiper.slides.eq(i);

            let slideProgress = swiper.slides[i].progress;
            console.log("slideProgress", i, slideProgress);
            let modify = 1;

            if (Math.abs(slideProgress) > 1) {
              modify = (Math.abs(slideProgress) - 1) * 0.3 + 1;
            }
            //这里的150是.swiper-slide宽度的一半，如果不是.swiper-slide宽度的一半，将出现异常的位置变化
            let translate = slideProgress * modify * 150 + "px";
            let scale = 1 - Math.abs(slideProgress) / 5;
            let zIndex = 999 - Math.abs(Math.round(10 * slideProgress));

            slide.transform(
              "translateX(" + translate + ") scale(" + scale + ")"
            );

            slide.css("zIndex", zIndex);
            slide.css("opacity", 1);
            if (Math.abs(slideProgress) > 3) {
              slide.css("opacity", 0);
            }
          }
        },
        onSetTransition: function (swiper, transition) {
          let slidesLen = swiper.slides.length;
          for (let i = 0; i < slidesLen; i++) {
            let slide = swiper.slides.eq(i);
            slide.transition(transition);
          }
        },
      },
    };
  },
  mounted() {
    /**初始化棋牌数组 */
    for (let i = 0; i < 19; i++) {
      this.list.push({
        name: i + 1,
      });
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.swiper-container {
  width: 100%;
  margin-top: calc(50% - 1.5rem);
}
.swiper-slide {
  width: 300px !important;
  height: 4.5rem !important;
  background: white;
  background-size: 100%;
  border: 1px solid #ccc;
  box-sizing: border-box;
  padding: 5px;
}

.content {
  width: 100%;
  height: 100vh;
  background: linear-gradient(to right, rgb(105, 70, 124), rgb(71, 61, 122));
  overflow: auto;
  position: relative;
}
</style>
