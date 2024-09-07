// https://github.com/XioDone/eslint-config

import linter from '@antfu/eslint-config'
import xiodone from '@xiodone/eslint-config'

export default linter(
  ...xiodone(),
  {
    rules: {
      'vue/component-name-in-template-casing': ['error', 'PascalCase', {
        registeredComponentsOnly: false,
      }],
    },
  },
)
