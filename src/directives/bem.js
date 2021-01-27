import { setup } from "bem-cn";
import { isArray, kebabCase, stubTrue, times, zipObject } from "lodash-es";

const block = setup({
  el: "__",
  mod: "--",
  modValue: "-",
});

const bemClasses = (name, element, modifiers) => {
  const b = block(name);
  return b(element ? kebabCase(element) : null, modifiers)
    .toString()
    .split(" ");
};

export default (el, { instance, arg, modifiers, value, oldValue }) => {
  if (isArray(oldValue)) {
    oldValue = zipObject(oldValue, times(oldValue.length, stubTrue));
  }

  if (isArray(value)) {
    value = zipObject(value, times(value.length, stubTrue));
  }

  const oldClasses = bemClasses(instance.$.type.name, arg, {
    ...modifiers,
    ...oldValue,
  });

  const newClasses = bemClasses(instance.$.type.name, arg, {
    ...modifiers,
    ...value,
  });

  el.classList.remove(...oldClasses);
  el.classList.add(...newClasses);
};
