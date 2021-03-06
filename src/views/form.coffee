import View       from  './view'
import inputify   from  './inputify'
import observable from 'riot-observable'

import Promise from 'broken'

# Supported Events:
#   submit - fired when form is submitted

class Form extends View
  # input for validate
  # configs: null

  # output from validate that's used for configuring InputViews
  # inputs: null

  # ref to use for validate
  # data: null

  initInputs: ->
    @inputs = {}

    if @configs?
      @inputs = inputify @data, @configs

      # make the input an observable so both form and input can observe it
      for name, input of @inputs
        observable input

  init: ->
    @initInputs()

  submit: (e) ->
    ps = []
    for name, input of @inputs
      pRef = {}
      input.trigger 'validate', pRef
      if pRef.p?
        ps.push pRef.p

    Promise.settle(ps).then (results) =>
      for result in results
        if !result.isFulfilled()
          return
      @_submit.apply @, arguments

    if e?
      e.preventDefault()
      e.stopPropagation()

    return false

  _submit: ->
    # do actual submit stuff

export default Form
