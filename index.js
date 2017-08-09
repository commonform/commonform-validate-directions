var analyze = require('commonform-analyze')

module.exports = function validateDirections (form, directions) {
  if (!Array.isArray(directions)) {
    return [{message: 'not an array'}]
  }

  var errors = directions.map(validateElement)
  var validDirections = errors.reduce(function (result, errors, index) {
    if (errors.length === 0) {
      result.push({
        index: index,
        direction: directions[index]
      })
    }
    return result
  }, [])

  var blanks = analyze(form).blanks
  validDirections.forEach(function checkBlanks (validDirection) {
    var direction = validDirection.direction
    var index = validDirection.index

    if (!blanks.some(function matchesDirectionBlank (blank) {
      return sameArray(blank, direction.blank)
    })) {
      errors.push({
        index: index,
        message: (
          'there is no blank at ' +
          JSON.stringify(direction.blank)
        )
      })
    }

    validDirections.forEach(function (otherValidDirection) {
      var otherDirection = otherValidDirection.direction
      var otherIndex = otherValidDirection.index
      if (
        index > otherIndex &&
        sameArray(otherDirection.blank, direction.blank)
      ) {
        errors.push({
          index: index,
          message: (
            'direction is for same blank as direction at index ' +
            otherIndex
          )
        })
      }
    })
  })

  blanks.forEach(function (blank) {
    if (!validDirections.some(function (validDirection) {
      return sameArray(validDirection.direction.blank, blank)
    })) {
      errors.push({
        message: 'no direction for blank at ' + JSON.stringify(blank)
      })
    }
  })

  return errors.reduce(function (errors, element) {
    return errors.concat(element)
  }, [])
}

function validateElement (element, index) {
  var returned = []
  if (typeof element !== 'object') {
    report('not an object')
  } else {
    if (!element.hasOwnProperty('blank')) {
      report('missing blank property')
    }

    if (!validBlankAddress(element.blank)) {
      report('invalid blank address')
    }

    var keys = Object.keys(element)
    if (element.hasOwnProperty('sameAs')) {
      if (keys.length !== 2) {
        keys
          .filter(function (key) {
            return key !== 'blank' && key !== 'sameAs'
          })
          .forEach(function (invalidKey) {
            report('invalid property: ' + invalidKey)
          })
      }
    } else {
      var invalidKeys = keys.filter(function (key) {
        return (
          key !== 'blank' &&
          key !== 'label' &&
          key !== 'notes' &&
          key !== 'examples'
        )
      })

      if (invalidKeys.length !== 0) {
        invalidKeys.forEach(function (invalidKey) {
          report('invalid property: ' + invalidKey)
        })
      }

      if (!keys.includes('blank')) {
        report('missing blank property')
      } else if (!validBlankAddress(element.blank)) {
        report('invalid blank address')
      }

      if (!keys.includes('label')) {
        report('missing label property')
      } else if (!isNonEmptyString(element.label)) {
        report('invalid label')
      }

      if (!keys.includes('notes')) {
        report('missing notes property')
      } else if (!element.notes.every(isNonEmptyString)) {
        report('invalid notes')
      }

      if (element.hasOwnProperty('examples')) {
        if (!Array.isArray(element.examples)) {
          report('examples is not an array')
        } else if (!element.examples.every(isNonEmptyString)) {
          report('invalid examples')
        }
      }
    }
  }

  return returned

  function report (message) {
    returned.push({
      index: index,
      message: message
    })
  }
}

function validBlankAddress (argument) {
  return (
    Array.isArray(argument) &&
    argument.length > 0 &&
    argument.every(function (element, index) {
      return (
        (
          element === 'content' &&
          (
            index === 0 ||
            argument[index - 1] === 'form'
          )
        ) ||
        (
          element === 'form' &&
          Number.isInteger(argument[index - 1])
        ) ||
        (
          Number.isInteger(element) &&
          element >= 0 &&
          argument[index - 1] === 'content'
        )
      )
    }) &&
    Number.isInteger(argument[argument.length - 1])
  )
}

function isNonEmptyString (argument) {
  return (
    typeof argument === 'string' &&
    argument.length !== 0
  )
}

function sameArray (a, b) {
  return (
    a.length === b.length &&
    a.every(function (element, index) {
      return element === b[index]
    })
  )
}
