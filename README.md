validate Common Form directions

```javascript
var assert = require('assert')
var validateDirections = require('commonform-validate-directions')

assert.deepEqual(
  validateDirections(
    {
      content: [
        'This agreement is between ',
        {blank: ''}, ' and ', {blank: ''}, '. ',
        {blank: ''}, ' and ', {blank: ''}, ' agree:'
      ]
    },
    [
      {
        blank: ['content', 1],
        label: 'First Party Name',
        notes: ['Use the legal name of the first party.'],
        examples: ['SomeCo, Inc.']
      },
      {
        blank: ['content', 3],
        label: 'Second Party Name',
        notes: ['Use the legal name of the second party.'],
        examples: ['SomeCo, Inc.']
      },
      {
        blank: ['content', 5],
        sameAs: ['content', 1]
      },
      {
        blank: ['content', 7],
        sameAs: ['content', 3]
      }
    ]
  ),
  []
)

assert.deepEqual(
  validateDirections(
    {
      content: [
        'This agreement is between ',
        {blank: ''}, ' and ', {blank: ''}, '.'
      ]
    },
    null
  ),
  [{message: 'not an array'}]
)

assert.deepEqual(
  validateDirections(
    {
      content: [
        'This agreement is between ',
        {blank: ''}, ' and ', {blank: ''}, '.'
      ]
    },
    [
      {
        blank: ['content', 1],
        label: '',
        notes: [''],
        examples: false
      },
      {
        blank: ['content', 3],
        label: 'Second Party Name',
        notes: [],
        examples: ['']
      }
    ]
  ),
  [
    {
      index: 0,
      message: 'invalid label'
    },
    {
      index: 0,
      message: 'invalid notes'
    },
    {
      index: 0,
      message: 'examples is not an array'
    },
    {
      index: 1,
      message: 'invalid examples'
    },
    {
      message: 'no direction for blank at ["content",1]'
    },
    {
      message: 'no direction for blank at ["content",3]'
    }
  ]
)

assert.deepEqual(
  validateDirections(
    {
      content: [
        'This agreement is between ',
        {blank: ''}, ' and ', {blank: ''}, '.'
      ]
    },
    [
      {
        blank: ['content', 1],
        invalid: 'First Party Name'
      },
      {
        blank: ['content', 3],
        label: 'Second Party Name',
        notes: ['Use the legal name of the second party.'],
        examples: ['SomeCo, Inc.']
      }
    ]
  ),
  [
    {
      index: 0,
      message: 'invalid property: invalid'
    },
    {
      index: 0,
      message: 'missing label property'
    },
    {
      index: 0,
      message: 'missing notes property'
    },
    {
      message: 'no direction for blank at ["content",1]'
    }
  ]
)

assert.deepEqual(
  validateDirections(
    {
      content: [
        'This agreement is between ',
        {blank: ''}, ' and ', {blank: ''}, '.'
      ]
    },
    [
      {
        blank: ['content', 2],
        label: 'First Party Name',
        notes: ['Use the legal name of the first party.']
      },
      {
        blank: ['content', 3],
        label: 'Second Party Name',
        notes: ['Use the legal name of the second party.']
      },
      null
    ]
  ),
  [
    {
      index: 2,
      message: 'not an object'
    },
    {
      index: 0,
      message: 'there is no blank at ["content",2]'
    },
    {
      message: 'no direction for blank at ["content",1]'
    }
  ]
)

assert.deepEqual(
  validateDirections(
    {
      content: [
        'This agreement is between ',
        {blank: ''}, ' and ', {blank: ''}, '.'
      ]
    },
    [
      {
        blank: ['content', 1],
        label: 'First Party Name',
        notes: ['Use the legal name of the first party.']
      },
      {
        blank: ['content', 3],
        label: 'Second Party Name',
        notes: ['Use the legal name of the second party.']
      },
      {
        blank: ['content', 3],
        label: 'Second Party Name',
        notes: ['Use the legal name of the second party.']
      }
    ]
  ),
  [
    {
      index: 2,
      message: 'direction is for same blank as direction at index 1'
    }
  ]
)

assert.deepEqual(
  validateDirections(
    {
      content: [
        'This agreement is between ',
        {blank: ''}, ' and ', {blank: ''}, '.'
      ]
    },
    [
      {
        label: 'First Party Name',
        notes: ['Use the legal name of the first party.']
      },
      {
        blank: ['invalid', 'data'],
        label: 'Bad Address',
        notes: ['Use the legal name of the first party.']
      },
      {
        sameAs: ['content', 1],
        invalid: 'property'
      },
      {
        blank: ['content', 1],
        label: 'First Party Name',
        notes: ['Use the legal name of the first party.']
      },
      {
        blank: ['content', 3],
        label: 'Second Party Name',
        notes: ['Use the legal name of the second party.']
      }
    ]
  ),
  [
    {
      index: 0,
      message: 'missing blank property'
    },
    {
      index: 1,
      message: 'invalid blank address'
    },
    {
      index: 2,
      message: 'missing blank property'
    },
    {
      index: 2,
      message: 'invalid property: invalid'
    }
  ]
)
```
