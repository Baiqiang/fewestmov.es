export default {
  title: 'Fewest Moves',
  header: {
    login: 'Login',
    logout: 'Logout',
  },
  common: {
    id: 'ID',
    wcaId: 'WCA ID',
    email: 'Email',
    home: 'Home',
    status: 'Status',
    yes: 'Yes',
    created_at: 'Created At',
    loginRequired: 'Login Required',
  },
  error: {
    title: {
      403: 'Forbidden',
      404: 'Page not found',
      other: 'An error occurred'
    }
  },
  loading: 'Loading...',
  description: {
    if: 'This is insertion finder.',
    sf: 'This is slicey finder.',
  },
  index: {
    defination: '<b>Fewest Moves</b> (or <b>F</b>ewest <b>M</b>oves <b>C</b>hallenge, <b>FMC</b>) is an event where competitors attempt to solve a puzzle (almost always the 3x3x3) in as few moves as possible, starting from a given scramble.<footer class="blockquote-footer text-right"><a href="https://www.speedsolving.com/wiki/index.php/Fewest_Moves_Challenge" target="_blank">SpeedSolving.com Wiki</a></footer>'
  },
  sf: {
    title: 'Slicey Finder',
    description: 'It\'s a useful tool to check the slicey insertions for 3x3x3 Fewest Moves.',
  },
  if: {
    title: 'Insertion Finder',
    description: 'It\'s a useful tool to check the optimal insertions for 3x3x3 Fewest Moves.',
    latest: 'Latest IF',
    name: {
      label: 'Name',
      description: 'You can type something to identify this insertion.',
    },
    scramble: {
      label: 'Scramble',
      description: 'Please don\'t input any invalid <a href="https://www.worldcubeassociation.org/regulations/#article-12-notation" target="_blank">notation</a>.',
      invalid: 'Please check your scramble!',
    },
    skeleton: {
      label: 'Skeleton',
      description: 'Only the followings are allowed:',
      invalid: 'Please check your skeleton!',
      list: [
        'WCA <a href="https://www.worldcubeassociation.org/regulations/#article-12-notation" target="_blank">notation</a>.',
        '"()" for inverse moves. "NISS" for switching scramble. But "()" and "NISS" can\'t be used at the same time.',
        'Any content after "//" in each line will be considered as comments.',
      ],
      to: '{length} to {detail}',
    },
    algs: {
      label: 'Algorithms',
      description: 'Please choose at least one algorithm.',
      corner: {
        label: 'Corners',
      },
      edge: {
        label: 'Edges',
      },
      other: {
        label: 'Other',
      },
      extra: {
        label: 'Extra',
      },
      '3CP': {
        label: '3 Corners',
        description: '',
      },
      '3CP-pure': {
        label: 'Pure 3 Corners',
        description: '',
      },
      '2x2CP': {
        label: '2-2 Corners',
        description: '',
      },
      CO: {
        label: 'Corner Twists',
        description: '',
      },
      'C-other': {
        label: 'Other Corners',
        description: '',
      },
      '3EP': {
        label: '3 Edges',
        description: '',
      },
      '2x2EP': {
        label: '2-2 Edges',
        description: '',
      },
      EO: {
        label: 'Edge Flips',
        description: '',
      },
      '3CP3EP': {
        label: '3 Corners and 3 Edges',
        description: '',
      },
      'E-other': {
        label: 'Other Edges',
        description: '',
      },
      parity: {
        label: 'Parity',
        description: '',
      },
      center: {
        label: 'Center',
        description: '',
      },
      'no-parity-other': {
        label: 'Other Algs without Parity',
        description: '',
      },
      'extras/parity': {
        label: 'Extra Parity'
      },
      'extras/no-parity-other': {
        label: 'Extra Algs without Parity'
      },
      all: 'All',
      none: 'None',
      necessary: 'Necessary',
    },
    greedy: {
      label: 'Greedy',
      description: 'It\'s a number N. Let\'s say when searching insertions for each step, the minimum moves of all skeletons is M. IF will keep all skeletons whose moves equal or less than M + N moves. 0 means always best first (human mode?).'
    },
    cycles: {
      label: 'Cycles',
      corners: 'Corners',
      edges: 'Edges',
      centers: 'Centers',
      parity: 'Parity',
    },
    status: [
      'Waiting',
      'Computing',
      'Finished',
    ],
    solutions: {
      label: 'Solutions',
      insertion: 'Insertion',
      insertions: 'Insertions',
      final: 'Final Solution',
      cancellation: 'Cancellation',
      exceed: "There're too many insertions to be inserted. I don't want to do it.",
      no_proper: 'There\'s no proper insertion.',
      merged: 'Merged',
      expanded: 'Expanded',
    },
    fewestmoves: 'Fewest Moves',
    duration: 'Calculation Duration',
  },
  user: {
    if: 'My IF',
    name: 'Name',
    avatar: 'Avatar',
    changeName: 'Change Name',
  },
  admin: {
    title: 'Admin',
    user: {
      title: 'User',
      if: '{name}\'s IF',
    },
    if: {
      title: 'IF',
    }
  },
  form: {
    submit: 'Submit',
    reset: 'Reset',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    deleteConfirm: 'Are you sure to delete this?',
  },
}
