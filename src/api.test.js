/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import {
  INITIAL_SUMS,
  INITIAL_ACCRUALS,
  adjustValues,
  calculateSums,
  calculateAccruals,
} from "./api";
import { takeRight } from "lodash-es";
import transitions from "./__mocks__/transitions.mock.json";
import transition_1_first_source from "./__mocks__/1-first-source.mock.json";
import transition_2_first_model from "./__mocks__/2-first-model.mock.json";
import transition_3_first_slot from "./__mocks__/3-first-slot.mock.json";
import transition_4_second_model from "./__mocks__/4-second-model.mock.json";
import transition_5_second_slot from "./__mocks__/5-second-slot.mock.json";
import transition_6_third_model from "./__mocks__/6-third-model.mock.json";
import transition_7_third_slot from "./__mocks__/7-third-slot.mock.json";
import transition_8_second_source from "./__mocks__/8-second-source.mock.json";

describe("utils.adjustValues", () => {
  test("Handles empty state", () => {
    const payload = { transitions: [], initial: {} };
    const values = adjustValues(payload);

    expect(values).toStrictEqual({});
  });

  test("Calculates a single source", () => {
    const payload = {
      transitions: takeRight(transitions),
      initial: {
        bases: { ...INITIAL_ACCRUALS },
        factors: { ...INITIAL_ACCRUALS },
      },
    };
    const values = adjustValues(payload);

    expect(values).toStrictEqual({
      bases: { influence: 1, bandwidth: 1 },
      factors: { influence: 0, bandwidth: 0 },
    });
  });

  test("Calculates a source and a slot with matching tree", () => {
    const payload = {
      transitions: takeRight(transitions, 3),
      initial: {
        bases: { ...INITIAL_ACCRUALS },
        factors: { ...INITIAL_ACCRUALS },
      },
    };
    const values = adjustValues(payload);

    expect(values).toStrictEqual({
      bases: { influence: 11, bandwidth: 2 },
      factors: { influence: 0.25, bandwidth: 0.3 },
    });
  });
});

describe("Real examples", () => {
  test("First source resources", () => {
    const resources = calculateSums({ transitions: transition_1_first_source });

    expect(resources).toStrictEqual({
      bonuses: {
        confidence: 0,
        data: 0,
      },
      costs: {
        confidence: 0,
        data: 0,
      },
    });
  });

  test("First source frequencies", () => {
    const frequencies = calculateAccruals({
      transitions: transition_1_first_source,
    });

    expect(frequencies).toStrictEqual({
      bases: {
        influence: 1,
        bandwidth: 1,
      },
      factors: {
        influence: 0,
        bandwidth: 0,
      },
    });
  });
});
