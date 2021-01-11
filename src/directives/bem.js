import { setup } from "bem-cn";
import { kebabCase } from "lodash-es";

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
