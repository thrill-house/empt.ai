import { extractValues } from "../score";
import { takeRight } from "lodash-es";
import transitions from "../__mocks__/transitions.mock.json";

test("Handles empty state", () => {
  const payload = { transitions: [], initial: {} };
  const values = extractValues(payload);
  expect(values).toStrictEqual({});
});

test("Calculates a single source", () => {
  const payload = {
    transitions: takeRight(transitions),
    initial: {
      bases: { influence: 0, bandwidth: 0 },
      factors: { influence: 0, bandwidth: 0 },
    },
  };
  const values = extractValues(payload);
  expect(values).toStrictEqual({
    bases: { influence: 1, bandwidth: 1 },
    factors: { influence: 0, bandwidth: 0 },
  });
});

test("Calculates a source and a slot with matching tree", () => {
  const payload = {
    transitions: takeRight(transitions, 2),
    initial: {
      bases: { influence: 0, bandwidth: 0 },
      factors: { influence: 0, bandwidth: 0 },
    },
  };
  const values = extractValues(payload);
  expect(values).toStrictEqual({
    bases: { influence: 4, bandwidth: 2 },
    factors: { influence: 0.2, bandwidth: 0.2 },
  });
});
