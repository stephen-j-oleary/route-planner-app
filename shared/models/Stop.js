import { entries, isArray, isObject, isString, join, merge, omitBy, trim } from "lodash";

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

  static fromString(string) {
    let parsed = string;
    parsed = isString(parsed) ? parsed.split(";") : [""];
    return new Stop({
      value: parsed.at(-1),
      modifiers: Object.fromEntries(parsed.slice(0, -1).map(item => item.split(":")))
    });
  }

  static toString(object) {
    const parsed = {};
    parsed.modifiers = Object.entries(object.modifiers)
      .map(([key, val]) => ([key, trim(val)]))
      .filter(([, val]) => val)
      .map(item => join(item, ":"));
    parsed.value = trim(object.value);
    return parsed.value
      ? [...parsed.modifiers, parsed.value].join(";")
      : "";
  }

  constructor(props = {}) {
    this.id = props.id;
    this.value = props.value ?? "";
    this.main_text = props.main_text ?? "";
    this.secondary_text = props.secondary_text;
    this.position = props.position;
    this.modifiers = props.modifiers;

    const parsedAddress = parseAddress(props.address);
    const parsedModifiers = parseModifiers(parsedAddress.modifiers, props.modifiers);

    this._modifiers = merge({}, DEFAULT_MODIFIERS, parsedModifiers);
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
    return [this.modifiersString, this.value].join(";");
  }
}