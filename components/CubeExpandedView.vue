<template>
  <div class="cube-expanded-view">
    <div v-for="(n, i) in 108" class="cube-facelet" :class="getClass(i)">
    </div>
  </div>
</template>

<script>
import { Cube, Algorithm } from 'insertionfinder'
import { removeComment } from '~/libs'

export default {
  props: {
    moves: String,
    best: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    facelet() {
      try {
        let cube = new Cube()
        cube.twist(new Algorithm(removeComment(this.moves)))
        if (this.best) {
          cube = cube.getBestPlacement()
        }
        return cube.toFaceletString()
      } catch (e) {
        return ''
      }
    }
  },
  methods: {
    getFaceletIndex(face, row, col) {
      return this.facelet.charAt('UDRLFB'.indexOf(face) * 9 + row * 3 + col).toLowerCase()
    },
    getClass(index) {
      const row = Math.floor(index / 12)
      const col = index % 12
      switch (true) {
        case row < 3:
          if (col >= 3 && col < 6) {
            return 'cube-facelet-' + this.getFaceletIndex('U', row, col - 3)
          }
          break
        case row < 6:
          switch (true) {
            case col < 3:
              return 'cube-facelet-' + this.getFaceletIndex('L', row - 3, col)
            case col < 6:
              return 'cube-facelet-' + this.getFaceletIndex('F', row - 3, col - 3)
            case col < 9:
              return 'cube-facelet-' + this.getFaceletIndex('R', row - 3, col - 6)
            case col < 12:
              return 'cube-facelet-' + this.getFaceletIndex('B', row - 3, col - 9)
          }
          break
        case row < 9:
          if (col >= 3 && col < 6) {
            return 'cube-facelet-' + this.getFaceletIndex('D', row - 6, col - 3)
          }
          break
      }
      return ''
    }
  }
}
</script>

<style lang="less">
.cube-expanded-view {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-width: 300px;
  .cube-facelet {
    flex: 0 0 8.33%;
    max-width: 8.33%;
    width: 8.33%;
    margin-top: -1px;
    margin-left: -1px;
    &:before {
      content: "";
      padding-top: 100%;
      display: table;
    }
  }
  @faceColors: {
    u: #fff;
    d: #ff0;
    r: #f00;
    l: #f80;
    f: #0f0;
    b: #00f;
  }
  each(@faceColors, {
    .cube-facelet-@{key} {
      background-color: @value;
      border: 1px solid #000;
    }
  })
}
</style>
