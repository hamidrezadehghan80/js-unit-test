import {
  it,
  expect,
  describe,
  beforeEach,
  beforeAll,
  afterEach,
  afterAll,
} from "vitest";
import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
  validateUserInput,
} from "../src/core";

describe("getCoupons", () => {
  it("should return an array of coupons", () => {
    const result = getCoupons();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should return an array with valid coupons code", () => {
    const result = getCoupons();
    result.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(typeof coupon.code).toBe("string");
      expect(coupon.code).toBeTruthy();
    });
  });

  it("should return an array with valid discount", () => {
    const result = getCoupons();
    result.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(typeof coupon.discount).toBe("number");
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe("calculateDiscount", () => {
  it("should return discounted price if give valid code", () => {
    expect(calculateDiscount(10, "SAVE10")).toBe(9);
    expect(calculateDiscount(10, "SAVE20")).toBe(8);
  });

  it("should handle non-numeric price", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i);
  });

  it("should handle negative price", () => {
    expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i);
  });

  it("should handle non-string discount code", () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });

  it("should handle invalid discount code", () => {
    expect(calculateDiscount(10, "INVALID")).toBe(10);
  });
});

describe("validateUserInput", () => {
  it("should return successful string if give valid username and age", () => {
    expect(validateUserInput("hamidreza", 23)).toMatch(/successful/i);
  });

  it("should handle non-string usernames", () => {
    expect(validateUserInput(10, 23)).toMatch(/invalid username/i);
  });

  it("should handle short usernames", () => {
    expect(validateUserInput("a", 23)).toMatch(/invalid username/i);
  });

  it("should handle long usernames", () => {
    expect(validateUserInput("a".repeat(256), 23)).toMatch(/invalid username/i);
  });

  it("should handle non-numeric ages", () => {
    expect(validateUserInput("hamidreza", "10")).toMatch(/invalid age/i);
  });

  it("should handle underage argument", () => {
    expect(validateUserInput("hamidreza", 12)).toMatch(/invalid age/i);
  });

  it("should handle overage argument", () => {
    expect(validateUserInput("hamidreza", 101)).toMatch(/invalid age/i);
  });

  it("should return an error if both username and age are invalid", () => {
    expect(validateUserInput("ha", 101)).toMatch(/invalid username/i);
    expect(validateUserInput("ha", 101)).toMatch(/invalid age/i);
  });
});

describe("isPriceInRange", () => {
  it.each([
    {
      price: -10,
      min: 0,
      max: 100,
      result: false,
      scenario: "should return false if price is outside of the range",
    },
    {
      price: 0,
      min: 0,
      max: 100,
      result: true,
      scenario: "should return true if price is equal to the min or max",
    },
    {
      price: 5,
      min: 0,
      max: 100,
      result: true,
      scenario: "should return true if price is within the range",
    },
    {
      price: 100,
      min: 0,
      max: 100,
      result: true,
      scenario: "should return true if price is equal to the min or max",
    },
    {
      price: 110,
      min: 0,
      max: 100,
      result: false,
      scenario: "should return false if price is outside of the range",
    },
  ])("$scenario", ({ price, min, max, result }) => {
    expect(isPriceInRange(price, min, max)).toBe(result);
  });

  // it("should return false if price is outside of the range", () => {
  //   expect(isPriceInRange(-10, 0, 100)).toBeFalsy();
  //   expect(isPriceInRange(110, 0, 100)).toBeFalsy();
  // });

  // it("should return true if price is equal to the min or max", () => {
  //   expect(isPriceInRange(0, 0, 100)).toBeTruthy();
  //   expect(isPriceInRange(100, 0, 100)).toBeTruthy();
  // });
  // it("should return true if price is within the range", () => {
  //   expect(isPriceInRange(5, 0, 100)).toBeTruthy();
  // });
});

describe("isValidUsername", () => {
  it("should return false if username length is outside of the boundary", () => {
    expect(isValidUsername("ham")).toBeFalsy();
    expect(isValidUsername("h".repeat(16))).toBeFalsy();
  });

  it("should return true if username length is equal to the min or max valid length", () => {
    expect(isValidUsername("hamid")).toBeTruthy();
    expect(isValidUsername("h".repeat(15))).toBeTruthy();
  });

  it("should return true if username length is within the range", () => {
    expect(isValidUsername("hamidreza")).toBeTruthy();
  });

  it("should return false for invalid input types", () => {
    expect(isValidUsername(null)).toBeFalsy();
    expect(isValidUsername(undefined)).toBeFalsy();
    expect(isValidUsername(10)).toBeFalsy();
  });
});

describe("canDrive", () => {
  it("should return invalid if countryCode is invalid", () => {
    expect(canDrive(20, "IR")).toMatch(/invalid/i);
  });

  it("should return true if age is equal to the minimum valid age", () => {
    expect(canDrive(17, "UK")).toBeTruthy();
    expect(canDrive(16, "US")).toBeTruthy();
  });

  it("should return true if age is above minimum legal age", () => {
    expect(canDrive(18, "UK")).toBeTruthy();
    expect(canDrive(17, "US")).toBeTruthy();
  });

  it("should return false if age is under minimum legal age", () => {
    expect(canDrive(16, "UK")).toBeFalsy();
    expect(canDrive(15, "US")).toBeFalsy();
  });
});

describe("fetchData", () => {
  it("should return a promise that will resolve an array of numbers", async () => {
    try {
      const result = await fetchData();
      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);

      // fetchData().then((result) => {
      //   expect(Array.isArray(result)).toBeTruthy();
      //   expect(result.length).toBeGreaterThan(0);
      // });
    } catch (error) {
      expect(error).toHaveProperty("reason");
      expect(error.reason).toMatch(/fail/i);
    }
  });
});

describe("test suit", () => {
  beforeAll(() => {
    console.log("beforeAll called");
  });

  beforeEach(() => {
    console.log("beforeEach called");
  });

  it("test case 1", () => {});

  it("test case 2", () => {});

  afterEach(() => {
    console.log("afterEach called");
  });

  afterAll(() => {
    console.log("afterAll called");
  });
});

describe("stack", () => {
  let stack;
  beforeEach(() => {
    stack = new Stack();
  });
  it("push should add an item to the stack", () => {
    // const stack = new Stack();
    stack.push(1);
    expect(stack.size()).toBe(1);
  });

  it("pop should remove and return above item of the stack", () => {
    // const stack = new Stack();
    stack.push(1);
    stack.push(2);
    expect(stack.pop()).toBe(2);
    expect(stack.size()).toBe(1);
  });

  it("pop should throw an error if the stack is empty", () => {
    // const stack = new Stack();
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  it("peek should return top of the stack without removing", () => {
    stack.push(1);
    stack.push(2);
    expect(stack.peek()).toBe(2);
    expect(stack.size()).toBe(2);
  });

  it("peek should throw an error if the stack is empty", () => {
    // const stack = new Stack();
    expect(() => stack.peek()).toThrow(/empty/i);
  });

  it("isEmpty should return true if the stack is empty", () => {
    // const stack = new Stack();
    expect(stack.isEmpty()).toBeTruthy();
  });

  it("isEmpty should return false if the stack is not empty", () => {
    // const stack = new Stack();
    stack.push(1);
    stack.push(2);
    expect(stack.isEmpty()).toBeFalsy();
  });

  it("size should return number of items in the stack", () => {
    stack.push(1);
    stack.push(2);
    expect(stack.size()).toBe(2);
  });

  it("clear should remove all of items in the stack", () => {
    stack.push(1);
    stack.push(2);
    stack.clear();
    expect(stack.size()).toBe(0);
  });
});
