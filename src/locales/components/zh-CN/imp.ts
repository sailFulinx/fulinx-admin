export default {
  imp: {
    name: '导入',
    impLog: '导入日志',
    notice: '注意事项',
    impFailedReason: '失败原因',
    impContent: '导入内容',
    noticeDescription: {
      one: '1、请先下载导入模板，下载的导入模板可以删除示例数据，但不可以新增或删除单元格列数',
      two: '2、文件必须是.xls或.xlsx格式',
      three: '3、导入前应仔细核对需要导入数据的数据是否正确，以免造成重大影响',
      four: '4、导入并不是实时的，可以稍后刷新此页面查看数据是否导入',
    },
    uploadSuccess: '上传成功，文件导入不是实时的，请耐心等待后端处理完成！',
    rules: {
      errorType: '文件类型错误，必须为.xls或.xlsx形式',
      errorSize: '文件不能大于5M',
    },
  },
}
