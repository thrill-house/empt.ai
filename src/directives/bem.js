import { setup } from "bem-cn";
import { kebabCase } from "lodash-es";

export default (el, { instance, arg, modifiers, value }) => {
  const block = setup({
    el: "__",
    mod: "--",
    modValue: "-",
  });
  const b = block(instance.$.type.name);
  const classes = b(arg ? kebabCase(arg) : null, { ...modifiers, ...value });

  classes
    .toString()
    .split(" ")
    .forEach((className) => {
      el.classList.add(className);
    });
};
