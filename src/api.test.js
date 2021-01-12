import { extractValues } from "./api";
import { takeRight } from "lodash-es";
import transitions from "./__mocks__/transitions.mock.json";

describe("utils.extractValues", () => {
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
      transitions: takeRight(transitions, 3),
      initial: {
        bases: { influence: 0, bandwidth: 0 },
        factors: { influence: 0, bandwidth: 0 },
      },
    };
    const values = extractValues(payload);

    expect(values).toStrictEqual({
      bases: { influence: 11, bandwidth: 2 },
      factors: { influence: 0.25, bandwidth: 0.3 },
    });
  });
});
