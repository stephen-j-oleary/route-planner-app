
import { isString, isArray, merge, isObject, cloneDeep, trim, update, omitBy, mapValues, join, pick, entries } from "lodash";

const DEFAULT_MODIFIERS = {
  type: "middle"
}

function parseAddress(value) {
  let parsed = value;
  if (isString(parsed)) parsed = parsed.split(";");
  if (!isArray(parsed)) parsed = [""];
  return {
    address: parsed.at(-1),
    modifiers: parsed.slice(0, -1).join(";")
  };
}

function parseModifiers(...values) {
  return merge(
    {},
    ...values.map(value => {
      let parsed = value;
      if (isString(parsed)) parsed = parsed.split(";");
      if (isArray(parsed)) parsed = Object.fromEntries(parsed.map(item => item.split(":")));
      if (!isObject(parsed)) parsed = {};
      return parsed;
    })
  );
}

export default class Stop {
  static MINIMUM_STOPS = 3;

  static create(props = {}) {
    return new Stop(props);
  }

  static fromString(string) {
    let parsed = string;
    parsed = isString(parsed) ? parsed.split(";") : [""];
    return new Stop({
      value: parsed.at(-1),
      modifiers: Object.fromEntries(parsed.slice(0, -1).map(item => item.split(":")))
    });
  }

  static toString(object) {
    const isWhitespace = val => !trim(val);

    let parsed = cloneDeep(object);
    parsed = update(parsed, "modifiers", val => {
      val = omitBy(val, isWhitespace);
      val = mapValues(val, trim);
      val = Object.entries(val);
      val = val.map(item => join(item, ":"));
      return val;
    });
    parsed = update(parsed, "value", trim);
    parsed = parsed.value
      ? [...parsed.modifiers, parsed.value].join(";")
      : "";
    return parsed;
  }

  constructor(props = {}) {
    const ALLOWED_PROPS = ["value", "main_text", "secondary_text", "position"];
    Object.assign(this, pick(props, ALLOWED_PROPS));

    const parsedAddress = parseAddress(props.address);
    const parsedModifiers = parseModifiers(parsedAddress.modifiers, props.modifiers);

    this._address = parsedAddress.address;
    this._modifiers = merge({}, DEFAULT_MODIFIERS, parsedModifiers);
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
    let newModifiers = merge({}, DEFAULT_MODIFIERS, parsedModifiers);
    newModifiers = omitBy(newModifiers, val => !!val?.trim());
    this._modifiers = newModifiers;
  }

  get modifierStrings() {
    return entries(this.modifiers).map(item => join(item, ":"));
  }

  get modifiersString() {
    return this.modifierStrings.join(";");
  }

  toString() {
    return [this.modifiersString, this.address].join(";");
  }
}
