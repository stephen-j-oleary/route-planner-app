
import _ from "lodash";

const DEFAULT_MODIFIERS = {
  type: "middle"
}

function parseAddress(value) {
  return _.chain(value)
    .thru(val => _.isString(val)
      ? val.split(";")
      : val)
    .thru(val => _.isArray(val)
      ? val
      : [""])
    .thru(val => ({
      address: val.at(-1),
      modifiers: val.slice(0, -1).join(";")
    }))
    .value();
}

function parseModifiers(...values) {
  return _.merge(
    {},
    ...values.map(value => _.chain(value)
      .thru(val => _.isString(val)
        ? val.split(";")
        : val)
      .thru(val => _.isArray(val)
        ? Object.fromEntries(val.map(item => item.split(":")))
        : val)
      .thru(val => _.isObject(val)
        ? val
        : {})
      .value()
    )
  );
}

export default class Stop {
  static MINIMUM_STOPS = 3;

  static create(props = {}) {
    return new Stop(props);
  }

  static fromString(string) {
    return new Stop(
      _.chain(string)
        .thru(val => _.isString(val)
          ? val.split(";")
          : [""])
        .thru(val => ({
          value: val.at(-1),
          modifiers: _.chain(val)
            .slice(0, -1)
            .map(item => item.split(":"))
            .fromPairs()
            .value()
        }))
        .value()
    );
  }

  static toString(object) {
    const joinColon = _.partial(_.join, _, ":");
    const isWhitespace = val => !_.trim(val);

    return _.chain(object)
      .cloneDeep()
      .update("modifiers", val => _.chain(val)
        .omitBy(isWhitespace)
        .mapValues(_.trim)
        .toPairs()
        .map(joinColon)
        .value())
      .update("value", _.trim)
      .thru(val => val.value
        ? [...val.modifiers, val.value].join(";")
        : "")
      .value();
  }

  constructor(props = {}) {
    const ALLOWED_PROPS = ["value", "main_text", "secondary_text", "position"];
    Object.assign(this, _.pick(props, ALLOWED_PROPS));

    const parsedAddress = parseAddress(props.address);
    const parsedModifiers = parseModifiers(parsedAddress.modifiers, props.modifiers);

    this._address = parsedAddress.address;
    this._modifiers = _.merge({}, DEFAULT_MODIFIERS, parsedModifiers);
  }

  get address() {
    return this._address;
  }

  set address(value) {
    const parsedAddress = parseAddress(value);
    this._address = parsedAddress.address;
  }

  get modifiers() {
    return this._modifiers;
  }

  set modifiers(value) {
    const parsedModifiers = parseModifiers(value);
    this._modifiers = _.chain({})
      .merge(DEFAULT_MODIFIERS, parsedModifiers)
      .omitBy(val => !!val?.trim())
      .value();
  }

  get modifierStrings() {
    const join = _.partial(_.join, _, ":");
    return _.entries(this.modifiers).map(join);
  }

  get modifiersString() {
    return this.modifierStrings.join(";");
  }

  toString() {
    return [this.modifiersString, this.address].join(";");
  }
}
