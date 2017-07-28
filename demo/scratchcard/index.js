'use strict';

const React = require('React');
const ReactNative = require('react-native');
const {
  ListView,
  View,
  StyleSheet,
  Text,
  Image,
  PanResponder
} = ReactNative;

// 获取坐标点
const getCoordinate = () => {
  let _width = 300
  let height = 150
  const w = 30
  const h = 30
  // let x = 0
  const result = []

  let y = w/2
  while (height > w/2) {
    let width = _width
    let x = w/2

    while (width > w/2) {
      result.push({
        x,
        y
      })
      x += w/5
      width -= w/5
    }

    y += h/5
    height -= w/5
  }

  return result
}

class Scratchcard extends React.Component {
  constructor(props) {
    super(props)

    this.touchCoordinates = getCoordinate()
    this.state = {
      showIndexs: {}
    }

    console.log(this.touchCoordinates)
  }

  componentWillMount = () => {
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        // console.log(111, evt.nativeEvent.locationX, evt.nativeEvent.locationY)
        // gestureState.{x,y} 现在会被设置为0
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近一次的移动距离为gestureState.move{X,Y}
        const {locationX, locationY} = evt.nativeEvent
        
        const touchPoints = this.getTouchPoint(locationX, locationY)

        if (touchPoints.length) {
          touchPoints.forEach(i => {
            this.state.showIndexs[i] = true
          })

          this.setState({
            showIndexs: this.state.showIndexs
          })
        }
        // console.log(233, evt.nativeEvent)
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
        // 一般来说这意味着一个手势操作已经成功完成。
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
        // 默认返回true。目前暂时只支持android。
        return true;
      },
    });
  }


  getTouchPoint(x, y) {
    const result = []

    this.touchCoordinates.forEach((item, i) => {
      const rangeX = x - item.x
      const rangeY = y - item.y

      if (rangeX <= 6 && rangeX > -6 && rangeY <= 6 && rangeY > -6) {
        if (!this.state.showIndexs[i]) result.push(i)
      }
    })

    return result
  }

  render() {
    return (
      <View style={style.container} {...this._panResponder.panHandlers} ref={'test'}>
        {
          Object.keys(this.state.showIndexs).map((i) => {
            const o = this.touchCoordinates[i]            
            return <View key={`show_${i}`} pointerEvents={'none'} style={[style.img, {left: o.x - 6, top: o.y - 6}]} />
          })
        }
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    width: 300,
    height: 150,
    marginLeft: 25,
    backgroundColor: '#ccc',
  },
  img: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
  }
})

module.exports = Scratchcard;