import { useUserStore } from '@/store/modules/user'

export const waterMarkCanvas = () => {
  // 在前端设置样式然后添加到背景中
  const waterMarkText = useUserStore().username // 水印名称
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') // 水印画布
  canvas.width = canvas.height = 150 // 水印高宽
  if (!ctx) return
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.globalAlpha = 0.2 // 水印透明度
  ctx.font = '12px Microsoft Yahei' // 水印字体
  ctx.translate(50, 50) // 水印完整性
  ctx.rotate(-Math.PI / 4)
  // if (store.state.user.theme === 'dark') ctx.fillStyle = '#bbb'
  ctx.fillText(waterMarkText, 0, 0)// 水印显示情况

  return {
    backgroundColor: {
      type: 'pattern',
      image: canvas,
      repeat: 'repeat'
    } as {
      type: 'pattern',
      image: HTMLCanvasElement,
      repeat: 'repeat'
    }
  }
}
