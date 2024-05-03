export const copyText = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showNotify({
        message: '复制成功',
        type: 'success'
      })
    })
    .catch(() => {
      showNotify({
        message: '复制失败',
        type: 'warning'
      })
    })
}
