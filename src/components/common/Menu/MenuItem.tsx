import { Icon } from '@iconify/vue'
import { ElMenuItem, ElSubMenu } from 'element-plus'
import { defineComponent, h } from 'vue'

const MenuItem = defineComponent({
  props: {
    item: {
      type: Object as () => AppRouteRecordRaw,
      required: true,
    },
  },
  setup(props) {
    const renderMenu = (item: AppRouteRecordRaw) => {
      const hasChildren = item.children && item.children.length > 0

      return hasChildren
        ? (
            <ElSubMenu index={item.fullPath}>
              {{
                title: () => (
                  <>
                    {item.meta?.icon && <Icon icon={item.meta.icon} size={4} class="mr-2" />}
                    <>{item.title}</>
                  </>
                ),
                default: () => (
                  <>{item.children?.map((child: AppRouteRecordRaw) => <MenuItem item={child} key={child.fullPath} />)}</>
                ),
              }}
            </ElSubMenu>
          )
        : (
            <ElMenuItem index={item.fullPath}>
              {item.meta?.icon && <Icon icon={item.meta.icon} size={4} class="mr-2" />}
              <>{item.title}</>
            </ElMenuItem>
          )
    }

    return () => renderMenu(props.item)
  },
})

export default MenuItem
