import { describe, test, it, expect } from "vitest";
import { calculateAverage, factorial, fizzBuzz, max } from "../src/intro";

describe("max", () => {
  it("should return the first argument if it is greater", () => {
    // // Arrange
    // const a = 2;
    // const b = 1;

    // // Act
    // const result = max(a, b);

    // // Assert
    // expect(result).toBe(2)

    expect(max(2, 1)).toBe(2);
  });
  it("should return the first argument if it is greater", () =>
    expect(max(2, 1)).toBe(2));
  it("should return the first argument if arguments are equal", () =>
    expect(max(1, 1)).toBe(1));
});

describe("fizzBuzz", () => {
  it("should return FizzBuzz if n%15 === 0", () => {
    expect(fizzBuzz(15)).toBe("FizzBuzz");
  });
  it("should return Fizz if n%3 === 0 and n%5 !== 0", () => {
    expect(fizzBuzz(9)).toBe("Fizz");
  });
  it("should return Buzz if n%5 === 0 and n%3 !== 0", () => {
    expect(fizzBuzz(10)).toBe("Buzz");
  });
  it("should return argument as string if n%15 !== 0 and n%3 !== 0 and n%5 !== 0", () => {
    expect(fizzBuzz(7)).toBe("7");
  });
});

describe("calculateAverage", () => {
  it("should return NaN if given an empty array", () => {
    expect(calculateAverage([])).toBe(NaN);
  });

  it("should calculate the average of an array with a single element", () => {
    expect(calculateAverage([1])).toBe(1);
  });

  it("should calculate the average of an array with two elements", () => {
    expect(calculateAverage([1, 2])).toBe(1.5);
  });

  it("should calculate the average of an array with more than 2 elements", () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

describe("factorial", () => {
  it("should return NaN if given an negative number", () => {
    expect(factorial(-2)).toBeUndefined();
  });

  it("should return 1 if get 0 as argument", () => {
    expect(factorial(0)).toBe(1);
  });

  it("should return 1 if get 1 as argument", () => {
    expect(factorial(1)).toBe(1);
  });

  it("should return 2 if get 2 as argument", () => {
    expect(factorial(2)).toBe(2);
  });

  it("should return 6 if get 3 as argument", () => {
    expect(factorial(3)).toBe(6);
  });

  it("should return 24 if get 4 as argument", () => {
    expect(factorial(4)).toBe(24);
  });
});
