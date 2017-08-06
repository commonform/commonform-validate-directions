var AJV = require('ajv')
var analyze = require('commonform-analyze')

var ajv = new AJV()
var validate = ajv.compile(require('commonform-directions-schema'))

module.exports = function validateDirections (form, directions) {
  validate(directions)
  var blanks = analyze(form).blanks
  if (validate.errors) {
    return validate.errors.map
  } else {
    var errors = []
    directions.forEach(function checkBlanks (direction, index) {
      if (!blanks.some(function matchesDirectionBlank (blank) {
        return sameArray(blank, direction.blank)
      })) {
        errors.push({
          index: index,
          message: (
            'There is no blank at ' +
            JSON.stringify(direction.blank) + '.'
          )
        })
      }
      directions.forEach(function (otherDirection, otherIndex) {
        if (
          index > otherIndex &&
          sameArray(otherDirection.blank, direction.blank)
        ) {
          errors.push({
            index: index,
            message: (
              'Direction is for same blank as direction at index ' +
              otherIndex + '.'
            )
          })
        }
      })
    })
    blanks.forEach(function (blank) {
      if (!directions.some(function (direction) {
        return sameArray(direction.blank, blank)
      })) {
        errors.push({
          message: (
            'No direction for blank at ' +
            JSON.stringify(blank) + '.'
          )
        })
      }
    })
    return errors.length === 0 ? true : errors
  }
}

function sameArray (a, b) {
  return (
    a.length === b.length &&
    a.every(function (element, index) {
      return element === b[index]
    })
  )
}
