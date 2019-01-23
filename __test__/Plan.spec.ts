import { Plan } from "../src/Plan";

const plan = new Plan();

describe("getHostCount", () => {
  it("normal condition", () => {
    const response = plan.getHostCount();
    const expectResponse = { productA: 2, productB: 3 };
    expect(response).toEqual(expectResponse);
  });
});
