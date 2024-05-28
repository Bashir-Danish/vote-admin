<template>
  <svg
      :viewBox="`0 0 ${UNITS} ${UNITS}`"
      :height="size || '100%'"
      :width="size || '100%'"
  >
    <g :transform="`rotate(${rotate},${UNITS/2},${UNITS/2}) ${reverse ? 'scale(1,-1) translate(0, -' + UNITS +')' : ''}`">
      <circle
          :cx="UNITS/2"
          :cy="UNITS/2"
          :r="getRadius()"
          :stroke="stroke"
          :stroke-width="getStrokeWidth(strokeWidth)"
          fill="none"
          :stroke-dasharray="getLengths()"
      />
      <path
          :d="describeArc(UNITS/2, UNITS/2, getRadius(), 0, activeEnd())"
          fill="none"
          :stroke="activeStroke"
          :stroke-width="getStrokeWidth(activeWidth)"
          :stroke-dasharray="getLengths()"
      />
    </g>
    <text class="text" fill="currentColor" x="50%" y="43%" text-anchor="middle" dominant-baseline="middle" >{{text}}</text>
    <text class="text2" fill="currentColor" x="50%" y="62%" text-anchor="middle" dominant-baseline="middle" >{{text2}}</text>
  </svg>
</template>

<script>
export default {
  name: 'CircularBar',
  beforeCreate() {
    this.UNITS = 200;
  },
  props: {
    size: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    text2: {
      type: String,
      default: ''
    },
    dashCount: {
      type: Number,
      default: 60
    },
    activeCount: {
      type: Number,
      default: 10
    },
    strokeWidth: {
      type: Number,
      default: 20
    },
    activeWidth: {
      type: Number,
      default: 20
    },
    stroke: {
      type: String,
      default: 'lightgrey'
    },
    activeStroke: {
      type: String,
      default: 'dodgerblue'
    },
    dashSpacing: {
      type: Number,
      default: 1/4
    },
    rotate: {
      type: Number,
      default: -90
    },
    reverse: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getStrokeWidth(stroke){
      return stroke*this.UNITS/200;
    },

    activeEnd(){
      if (this.activeCount == 0){
        return 0
      }
      return 360 * (this.activeCount*this.dashPerc() + (this.activeCount-1)*this.spacePerc())
    },

    getLengths(){
      return [2*Math.PI*this.getRadius()*this.dashPerc(), 2*Math.PI*this.getRadius()*this.spacePerc()]
    },

    spacePerc(){
      return this.dashSpacing/this.dashCount;
    },

    dashPerc(){
      return (1-this.dashSpacing)/this.dashCount;
    },

    getRadius(){
      return (this.UNITS-Math.max(this.getStrokeWidth(this.strokeWidth), this.getStrokeWidth(this.activeWidth)))/2
    },

    polarToCartesian(cx, cy, radius, degrees) {
      const radians = degrees * Math.PI / 180.0;
      return {
        x: cx + (radius * Math.cos(radians)),
        y: cy + (radius * Math.sin(radians))
      };
    },

    describeArc(cx, cy, radius, startDegrees, endDegrees){
      const start = this.polarToCartesian(cx, cy, radius, startDegrees);
      const end = this.polarToCartesian(cx, cy, radius, endDegrees);

      let largeArc = (Math.abs(endDegrees-startDegrees) < 180) ? 0 : 1;
      let sweep = (endDegrees < startDegrees) ? 0 : 1;

      return `M${start.x} ${start.y} A${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`
    },
  }
}
</script>

<style scoped>
.text {
  font-size: 40px;
  color: black;
  font-weight: 600;
  font-family: var(--vt-f-heading), sans-serif;
}
.text2 {
  font-size: 24px;
  color: #7D86A9;
  font-weight: 600;
  font-family: var(--vt-f-heading), sans-serif;
}
</style>