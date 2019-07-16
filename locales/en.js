export default {
  title: 'Fewest Moves',
  header: {
    login: 'Login',
    logout: 'Logout',
  },
  common: {
    home: 'Home',
    status: 'Status',
    yes: 'Yes',
    created_at: 'Created At',
  },
  error: {
    title: {
      404: 'Page not found',
      other: 'An error occurred'
    }
  },
  loading: 'Loading...',
  description: {
    if: 'This is insertion finder.',
  },
  if: {
    title: 'Insertion Finder',
    description: 'It\'s a useful tool to check the optimal insertions for 3x3x3 Fewest Moves.',
    name: {
      label: 'Name',
      description: '',
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
        '"()" for inverse moves. "NISS" for switching scramble. But "()" and "NISS" can\'t used at once.',
        'Any content after "//" in each line will be considered as comments.',
      ],
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
      no_proper: 'There\'s proper insertion.',
    },
    fewestmoves: 'Fewest Moves',
  },
  user: {
    insertions: 'My Insertions',
    if: {
      changeName: 'Change Name',
    },
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
