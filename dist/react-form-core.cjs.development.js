'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var initialState = {
  value: {
    errors: {},
    ev: false,
    initialValues: {},
    resetted: false,
    setError: function setError(_name, _error) {},
    setInitialValue: function setInitialValue(_name, _value) {},
    setSuccess: function setSuccess(_name, _success) {},
    setValue: function setValue(_name, _value) {},
    submitted: false,
    successes: {},
    values: {}
  }
};

var FormContext = /*#__PURE__*/React.createContext(initialState.value);

// @see: https://30secondsofcode.org/function#debounce
var debounce = function debounce(fn, ms) {
  if (ms === void 0) {
    ms = 0;
  }

  var timeout;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      fn.apply(null, args);
    }, ms);
  };
};

// https://30secondsofcode.org/object#omit
var omit = function omit(obj, arr) {
  return Object.keys(obj).reduce(function (acc, key) {
    if (!arr.includes(key)) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
};

var Form = function Form(_ref) {
  var children = _ref.children,
      onReset = _ref.onReset,
      onSubmit = _ref.onSubmit,
      wait = _ref.wait,
      rest = _objectWithoutPropertiesLoose(_ref, ["children", "onReset", "onSubmit", "wait"]);

  var _React$useState = React.useState({
    errors: {},
    ev: false,
    initialValues: {},
    resetted: false,
    submitted: false,
    successes: {},
    values: {},
    setError: debounce(handleError, !wait ? 750 : wait),
    setInitialValue: handleInitialValue,
    setSuccess: debounce(handleSuccess, !wait ? 750 : wait),
    setValue: handleValue
  }),
      state = _React$useState[0],
      setState = _React$useState[1];

  React.useEffect(function () {
    var submitted = state.submitted;

    if (submitted && onSubmit) {
      onSubmit(_extends({}, state));
      setState(function (prevState) {
        return _extends({}, prevState, {
          submitted: false
        });
      });
    }
  }, [onSubmit, state]);
  React.useEffect(function () {
    var resetted = state.resetted;
    var formEvent = state.ev;

    if (formEvent && resetted && onReset) {
      onReset(_extends({
        ev: formEvent
      }, state));
      setState(function (prevState) {
        return _extends({}, prevState, {
          resetted: false
        });
      });
    }
  }, [onReset, state]);

  function handleInitialValue(name, initialValue) {
    setState(function (prevState) {
      var _extends2, _extends3;

      return _extends({}, prevState, {
        initialValues: _extends({}, prevState.initialValues, (_extends2 = {}, _extends2[name] = initialValue, _extends2)),
        values: _extends({}, prevState.values, (_extends3 = {}, _extends3[name] = initialValue, _extends3))
      });
    });
  }

  function handleValue(name, newValue) {
    setState(function (prevState) {
      var _extends4;

      return _extends({}, prevState, {
        errors: omit(prevState.errors, [name]),
        submitted: false,
        successes: omit(state.successes, [name]),
        values: _extends({}, prevState.values, (_extends4 = {}, _extends4[name] = newValue, _extends4))
      });
    });
  }

  function handleError(name, error) {
    setState(function (prevState) {
      var _extends5;

      return _extends({}, prevState, {
        errors: _extends({}, prevState.errors, (_extends5 = {}, _extends5[name] = error, _extends5))
      });
    });
  }

  function handleSuccess(name, success) {
    setState(function (prevState) {
      var _extends6;

      return _extends({}, prevState, {
        successes: _extends({}, prevState.successes, (_extends6 = {}, _extends6[name] = success, _extends6))
      });
    });
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    ev.persist();
    setState(function (prevState) {
      return _extends({}, prevState, {
        ev: ev,
        submitted: true
      });
    });
  }

  function handleReset(ev) {
    ev.preventDefault();
    ev.persist();
    setState(function (prevState) {
      return _extends({}, prevState, {
        errors: {},
        ev: ev,
        resetted: true,
        successes: {},
        values: prevState.initialValues
      });
    });
  }

  return React.createElement(FormContext.Provider, {
    value: state
  }, React.createElement("form", Object.assign({}, rest, {
    onSubmit: handleSubmit,
    onReset: handleReset
  }), children));
};

var FormConsumer = function FormConsumer(_ref) {
  var children = _ref.children;
  return React.createElement(FormContext.Consumer, null, children);
};

var Field = function Field(_ref) {
  var children = _ref.children,
      name = _ref.name,
      onChange = _ref.onChange,
      value = _ref.value,
      rest = _objectWithoutPropertiesLoose(_ref, ["checked", "children", "name", "onChange", "value"]);

  var _React$useContext = React.useContext(FormContext),
      setInitialValue = _React$useContext.setInitialValue,
      setValue = _React$useContext.setValue,
      values = _React$useContext.values;

  var valueByName = values[name];
  var childrenProps = children.props;
  var childrenValue = childrenProps.value;
  var hasCheckedAttr = /checkbox|radio/.test(childrenProps === null || childrenProps === void 0 ? void 0 : childrenProps.type);
  var noneValue = childrenProps.multiple ? [''] : '';
  var valueAttr = hasCheckedAttr ? {
    checked: valueByName === value
  } : {
    value: valueByName || noneValue
  };

  var _React$useState = React.useState(),
      onChangeEvent = _React$useState[0],
      setOnChangeEvent = _React$useState[1];

  var _React$useState2 = React.useState(valueByName),
      fieldValue = _React$useState2[0],
      setFieldValue = _React$useState2[1];

  if (!name) {
    throw new Error('Error: Please, you have to add a name to the form field');
  }

  React.useEffect(function () {
    var timer = 0; // handle elements with on change

    if (onChangeEvent && onChange) {
      onChangeEvent && onChange && onChange(onChangeEvent);
      timer = setTimeout(function () {
        return setValue(name, fieldValue);
      });
    } else if (typeof fieldValue !== 'undefined') {
      // avoid radio fields not checked
      setValue(name, fieldValue);
    } // handle radio fields not checked


    if ((childrenProps === null || childrenProps === void 0 ? void 0 : childrenProps.type) === 'radio') {
      valueByName !== value && setFieldValue(undefined);
    }

    return function () {
      timer && clearTimeout(timer);
    };
  }, [fieldValue, setValue]); // Set initial values

  React.useEffect(function () {
    var checkedValue = childrenProps.checked ? childrenValue : '';
    var initialValue = hasCheckedAttr ? checkedValue : childrenValue;
    initialValue !== '' && setInitialValue(name, initialValue);
    initialValue !== '' && setValue(name, initialValue);
  }, []);

  function handleChange(ev) {
    var target = ev.target;
    var newValue = target.type === 'select-multiple' ? Array.from(target.selectedOptions).map(function (option) {
      return option.value;
    }) : target.value;
    var checkedValue = target.checked === true ? newValue : '';
    ev.persist();
    setFieldValue(hasCheckedAttr ? checkedValue : newValue);
    setOnChangeEvent(ev);
  }

  return React.cloneElement(children, _extends({}, rest, {}, valueAttr, {
    name: name,
    onChange: handleChange
  }));
};

var Validator = function Validator(_ref) {
  var _element$props;

  var children = _ref.children,
      validation = _ref.validation,
      name = _ref.name,
      rest = _objectWithoutPropertiesLoose(_ref, ["children", "validation", "name"]);

  var _React$useContext = React.useContext(FormContext),
      errors = _React$useContext.errors,
      _setError = _React$useContext.setError,
      _setSuccess = _React$useContext.setSuccess,
      successes = _React$useContext.successes,
      values = _React$useContext.values;

  var getMessage = function getMessage(onChange) {
    return function (ev) {
      ev.preventDefault();
      validation({
        errors: errors,
        setError: function setError(error) {
          return _setError(name, error);
        },
        setSuccess: function setSuccess(success) {
          return _setSuccess(name, success);
        },
        successes: successes,
        value: ev.target.value,
        values: values
      });
      onChange && onChange(ev);
    };
  };

  var element = children;
  return React.cloneElement(element, _extends({}, rest, {
    onChange: getMessage(element === null || element === void 0 ? void 0 : (_element$props = element.props) === null || _element$props === void 0 ? void 0 : _element$props.onChange)
  }));
};

var withValidation = function withValidation(_ref) {
  var name = _ref.name,
      validation = _ref.validation,
      rest = _objectWithoutPropertiesLoose(_ref, ["name", "validation"]);

  return function (FormField) {
    return React.createElement(Validator, {
      name: name,
      validation: validation
    }, React.createElement(FormField, Object.assign({
      name: name
    }, rest)));
  };
};

exports.Field = Field;
exports.Form = Form;
exports.FormConsumer = FormConsumer;
exports.FormContext = FormContext;
exports.Validator = Validator;
exports.debounce = debounce;
exports.initialState = initialState;
exports.omit = omit;
exports.withValidation = withValidation;
//# sourceMappingURL=react-form-core.cjs.development.js.map
