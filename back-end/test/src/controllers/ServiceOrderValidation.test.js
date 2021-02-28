import { validateDateOneLessOrEqualThanDateTwo } from "../../../src/utils/validatorUtils";

const serviceOrder = {
  entryDate: "2021-02-28T15:35:39.512Z",
  deliveryDate: "2021-03-01T15:35:00.000Z",
};

describe("validateDate", () => {
  it("should entryDate minor than deliveryDate", () => {
    const { entryDate, deliveryDate } = serviceOrder;
    const result = validateDateOneLessOrEqualThanDateTwo(
      new Date(entryDate),
      new Date(deliveryDate)
    );
    expect(result).toBe(true);
  });

  it("should entryDate equal to deliveryDate", () => {
    const { entryDate } = serviceOrder;
    const deliveryDate = entryDate;
    const result = validateDateOneLessOrEqualThanDateTwo(
      new Date(entryDate),
      new Date(deliveryDate)
    );
    expect(result).toBe(true);
  });

  it("should be false if entryDate is bigger than deliveryDate", () => {
    const { entryDate, deliveryDate } = serviceOrder;
    const deliveryDateNew = entryDate;
    const entryDateNew = deliveryDate;
    const result = validateDateOneLessOrEqualThanDateTwo(
      new Date(entryDateNew),
      new Date(deliveryDateNew)
    );
    expect(result).toBe(false);
  });
});
