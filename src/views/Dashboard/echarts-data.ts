import { BarChart } from 'echarts/charts'
import { GridComponent, LegendComponent, ToolboxComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

import type { BarSeriesOption } from 'echarts/charts'
import type {
  GridComponentOption,
  LegendComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption,
} from 'echarts/components'

use([CanvasRenderer, BarChart, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent])

type EChartsOption = echarts.ComposeOption<
  ToolboxComponentOption | TooltipComponentOption | GridComponentOption | LegendComponentOption | BarSeriesOption
>

const app: any = {}

const posList = [
  'left',
  'right',
  'top',
  'bottom',
  'inside',
  'insideTop',
  'insideLeft',
  'insideRight',
  'insideBottom',
  'insideTopLeft',
  'insideTopRight',
  'insideBottomLeft',
  'insideBottomRight',
] as const

app.configParameters = {
  rotate: {
    min: -90,
    max: 90,
  },
  align: {
    options: {
      left: 'left',
      center: 'center',
      right: 'right',
    },
  },
  verticalAlign: {
    options: {
      top: 'top',
      middle: 'middle',
      bottom: 'bottom',
    },
  },
  position: {
    options: posList.reduce(
      (map, pos) => {
        map[pos] = pos
        return map
      },
      {} as Record<string, string>,
    ),
  },
  distance: {
    min: 0,
    max: 100,
  },
}

app.config = {
  rotate: 90,
  align: 'left',
  verticalAlign: 'middle',
  position: 'insideBottom',
  distance: 15,
  // onChange: function () {
  //   const labelOption: BarLabelOption = {
  //     rotate: app.config.rotate as BarLabelOption['rotate'],
  //     align: app.config.align as BarLabelOption['align'],
  //     verticalAlign: app.config.verticalAlign as BarLabelOption['verticalAlign'],
  //     position: app.config.position as BarLabelOption['position'],
  //     distance: app.config.distance as BarLabelOption['distance']
  //   }
  //   myChart.setOption<echarts.EChartsOption>({
  //     series: [
  //       {
  //         label: labelOption
  //       },
  //       {
  //         label: labelOption
  //       },
  //       {
  //         label: labelOption
  //       },
  //       {
  //         label: labelOption
  //       }
  //     ]
  //   })
  // }
}

type BarLabelOption = NonNullable<echarts.BarSeriesOption['label']>

const labelOption: BarLabelOption = {
  show: true,
  position: app.config.position as BarLabelOption['position'],
  distance: app.config.distance as BarLabelOption['distance'],
  align: app.config.align as BarLabelOption['align'],
  verticalAlign: app.config.verticalAlign as BarLabelOption['verticalAlign'],
  rotate: app.config.rotate as BarLabelOption['rotate'],
  formatter: '{c}  {name|{a}}',
  fontSize: 16,
  rich: {
    name: {},
  },
}

export const option = ref<EChartsOption>({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['订单总数', '已完成', '未完成', '返修'],
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar', 'stack'] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: ['10/1', '10/2', '10/3', '10/4', '10/5'],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      name: '订单总数',
      type: 'bar',
      barGap: 0,
      label: labelOption,
      emphasis: {
        focus: 'series',
      },
      data: [320, 332, 301, 334, 390],
    },
    {
      name: '已完成',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series',
      },
      data: [220, 182, 191, 234, 290],
    },
    {
      name: '未完成',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series',
      },
      data: [150, 232, 201, 154, 190],
    },
    {
      name: '返修',
      type: 'bar',
      label: labelOption,
      emphasis: {
        focus: 'series',
      },
      data: [98, 77, 101, 99, 40],
    },
  ],
})
