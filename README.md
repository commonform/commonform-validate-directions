```javascript
var assert = require('assert')
var validateDirections = require('commonform-validate-directions')

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
        label: "First Party Name",
        notes: ['Use the legal name of the first party.'],
        examples: ['SomeCo, Inc.']
      },
      {
        blank: ['content', 3],
        label: "Second Party Name",
        notes: ['Use the legal name of the second party.'],
        examples: ['SomeCo, Inc.']
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
    [
      {
        blank: ['content', 1],
        invalid: "First Party Name"
      },
      {
        blank: ['content', 3],
        label: "Second Party Name",
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
        label: "First Party Name",
        notes: ['Use the legal name of the first party.']
      },
      {
        blank: ['content', 3],
        label: "Second Party Name",
        notes: ['Use the legal name of the second party.']
      }
    ]
  ),
  [
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
        label: "First Party Name",
        notes: ['Use the legal name of the first party.']
      },
      {
        blank: ['content', 3],
        label: "Second Party Name",
        notes: ['Use the legal name of the second party.']
      },
      {
        blank: ['content', 3],
        label: "Second Party Name",
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
```
