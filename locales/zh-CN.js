export default {
  title: '最少步',
  header: {
    login: '登录',
    logout: '退出',
  },
  common: {
    id: 'ID',
    wcaId: 'WCA ID',
    email: '邮箱',
    home: '首页',
    status: '状态',
    yes: '是',
    created_at: '创建于',
    loginRequired: '请登录',
  },
  error: {
    title: {
      403: '没有权限',
      404: '页面未找到',
      other: '发生了一个错误'
    }
  },
  loading: '加载中...',
  description: {
    if: '这个是最少步找插入工具。',
    sf: '这个是最少步插中层工具。',
  },
  index: {
    defination: '<b>最少步</b>（或称最少步挑战、<b>FMC</b>）是选手根据给定的打乱公式，尝试用尽可能少的步数还原魔方（通常是三阶）的项目。<footer class="blockquote-footer text-right"><a href="https://www.speedsolving.com/wiki/index.php/Fewest_Moves_Challenge" target="_blank">SpeedSolving.com 维基百科</a></footer>'
  },
  sf: {
    title: '插中层',
    description: '一个利用插入中层将复原步骤变短的工具。',
  },
  if: {
    title: '找插入',
    description: '一个用于检查三阶最少步插入是否最优的实用工具。',
    latest: '最近的插入',
    name: {
      label: '名称',
      description: '可以输入一些用以区分这条插入的文字。',
    },
    scramble: {
      label: '打乱',
      description: '请勿输入任何非法<a href="https://www.worldcubeassociation.org/regulations/translations/chinese/#12a" target="_blank">转动步骤</a>！',
      invalid: '请检查你的打乱！',
    },
    skeleton: {
      label: '复原',
      description: '只允许以下输入：',
      invalid: '请检查你的复原！',
      list: [
        'WCA<a href="https://www.worldcubeassociation.org/regulations/translations/chinese/#article-12-notation" target="_blank">转动步骤</a>；',
        '"()"表示逆序；"NISS"用以切换打乱正序或者逆序；二者不可混合使用；',
        '每一行的"//"及其之后的内容表示注释。',
      ],
      to: '{length}步剩{detail}',
    },
    algs: {
      label: '公式集',
      description: '',
      corner: {
        label: '角块',
      },
      edge: {
        label: '棱块',
      },
      other: {
        label: '其他',
      },
      extra: {
        label: '额外',
      },
      '3CP': {
        label: '三角换',
        description: '',
      },
      '3CP-pure': {
        label: '纯粹三角换',
        description: '',
      },
      '2x2CP': {
        label: '2-2角',
        description: '',
      },
      CO: {
        label: '翻角',
        description: '',
      },
      'C-other': {
        label: '其他角块',
        description: '',
      },
      '3EP': {
        label: '三棱换',
        description: '',
      },
      '2x2EP': {
        label: '2-2棱',
        description: '',
      },
      EO: {
        label: '翻棱',
        description: '',
      },
      'E-other': {
        label: '其他棱块',
        description: '',
      },
      parity: {
        label: 'Parity',
        description: '',
      },
      center: {
        label: '中心',
        description: '',
      },
      'no-parity-other': {
        label: '其他没有parity的公式',
        description: '',
      },
      'extras/parity': {
        label: '额外Parity'
      },
      'extras/no-parity-other': {
        label: '额外没有parity的公式'
      },
      all: '全选',
      none: '全不选',
      necessary: '仅选择必要',
    },
    greedy: {
      label: '搜索参数',
      description: '设置一个数字 N ，假设每次搜索得到的众多复原步骤中最短的一个步数为 M，则保留步数小于等于 M + N的复原进行下一步搜索。0 意味着永远是最优消去优先（近似人脑模式）。'
    },
    cycles: {
      label: '循环',
      corners: '角块',
      edges: '棱块',
      centers: '中心',
      parity: 'Parity',
    },
    status: [
      '等待中',
      '计算中',
      '已完成',
    ],
    solutions: {
      label: '解法',
      insertion: '插入',
      insertions: '插入个数',
      final: '最终解法',
      cancellation: '消去步数',
      exceed: "你妹的，要插入的循环太多了",
      no_proper: '找不到合适的插入',
      merged: '合并',
      expanded: '展开',
    },
    fewestmoves: '最少步数',
    duration: '计算耗时',
  },
  user: {
    if: '我的插入',
    name: '姓名',
    avatar: '头像',
    changeName: '修改名称',
  },
  admin: {
    title: '管理',
    user: {
      title: '用户',
      if: '{name}的插入',
    },
    if: {
      title: '插入',
    }
  },
  form: {
    submit: '提交',
    reset: '重置',
    save: '保存',
    cancel: '取消',
    delete: '删除',
    deleteConfirm: '确认要删除这条记录吗？',
  },
}
