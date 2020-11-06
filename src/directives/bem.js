import { setup } from "bem-cn";

export default (el, { instance, arg, modifiers, value }) => {
  const block = setup({
    el: "__",
    mod: "--",
    modValue: "-",
  });
  const b = block(instance.$.type.name);
  const classes = b(arg, { ...modifiers, ...value });

  classes
    .toString()
    .split(" ")
    .forEach((className) => {
      el.classList.add(className);
    });
};
