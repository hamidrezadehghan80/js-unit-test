import { it, expect, describe, vi, beforeEach } from "vitest";
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";
import { sendEmail } from "../src/libs/email";
import security from "../src/libs/security";

vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");
vi.mock("../src/libs/email", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

describe("test suite", () => {
  it("test case", () => {
    const greet = vi.fn();
    // greet.mockReturnValue("Hello")
    // greet.mockResolvedValue("Hello");
    greet.mockImplementation((name) => "hello " + name);

    const result = greet("hamidreza");

    // console.log(result);

    // expect(greet).toBeCalled();
    // expect(greet).toBeCalledWith("hamidreza");
    expect(greet).toHaveBeenCalledOnce();
  });

  it("mockExercise", () => {
    const sendText = vi.fn();
    // greet.mockReturnValue("Hello")
    // greet.mockResolvedValue("Hello");
    sendText.mockImplementation((message) => {
      console.log(message);
      return "ok";
    });

    const result = sendText("hello world!!");
    expect(sendText).toBeCalled();
    expect(result).toBe("ok");
  });
});

describe("getPriceInCurrency", () => {
  it("should return price in target currency", () => {
    vi.mocked(getExchangeRate).mockReturnValue(60);

    const price = getPriceInCurrency(10, "IRT");

    expect(price).toBe(600);
  });
});

describe("getShippingInfo", () => {
  it("should return shipping cost", () => {
    vi.mocked(getShippingQuote).mockReturnValue({
      cost: 100,
      estimatedDays: 2,
    });

    const shippingInfo = getShippingInfo("Tehran");

    expect(shippingInfo).toMatch(`$100`);
    expect(shippingInfo).toMatch(/2 days/i);
  });

  it("should return shipping unavailable if quote is undefined", () => {
    vi.mocked(getShippingQuote).mockReturnValue(undefined);

    const shippingInfo = getShippingInfo("Tehran");

    expect(shippingInfo).toMatch(/unavailable/i);
  });
});

describe("renderPage", () => {
  it("should return correct content", async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i);
  });

  it("should call analytics", async () => {
    await renderPage();
    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

describe("submitOrder", () => {
  it("should call charge with correct argument", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });
    await submitOrder({ totalAmount: 100 }, { creditCardNumber: "123456" });
    expect(charge).toHaveBeenCalled({ creditCardNumber: "123456" }, 100);
  });

  it("should return success if payment was successful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });
    const result = await submitOrder(
      { totalAmount: 100 },
      { creditCardNumber: "123456" }
    );
    expect(result).toEqual({ success: true });
  });

  it("should return error object if payment was failed", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });
    const result = await submitOrder(
      { totalAmount: 100 },
      { creditCardNumber: "123456" }
    );
    expect(result).toHaveProperty("success", false);
    expect(result).toHaveProperty("error");
    expect(result.error).toMatch(/error/i);
  });
});

describe("signup", () => {

  it("should return false if email is not valid", async () => {
    const result = await signUp("a");
    expect(result).toBe(false);
  });

  it("should return true if email is valid", async () => {
    const result = await signUp("test@test.com");
    expect(result).toBe(true);
  });

  it("should send welcome email is email is valid", async () => {
    await signUp("test@test.com");
    expect(sendEmail).toHaveBeenCalledOnce();
    // console.log(vi.mocked(sendEmail).mock.calls[0]);
    const args = vi.mocked(sendEmail).mock.calls[0];

    expect(args[0]).toBe("test@test.com");
    expect(args[1]).toMatch(/welcome/i);
  });
});

describe("login", () => {
  it("should email the one-time login code", async () => {
    const spy = vi.spyOn(security, "generateCode");

    await login("test@test.com");

    // console.log(spy.mock.results[0]);
    const securityCode = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith("test@test.com", securityCode);
  });
});

describe('isOnline', () => {
  it('should return false if current hour is outside of opening hour', () => {
    vi.setSystemTime("2024-01-01 7:59");
    expect(isOnline()).toBe(false);

    vi.setSystemTime("2024-01-01 20:01");
    expect(isOnline()).toBe(false);
  })

  it('should return true if current hour is within opening hour', () => {
    vi.setSystemTime("2024-01-01 8:00");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2024-01-01 19:59");
    expect(isOnline()).toBe(true);
  })
})

describe('getDiscount', () => {
  it('should get discount if is christmas day', () => {
    vi.setSystemTime("2024-12-25 00:00");
    expect(getDiscount()).toBe(0.2);
    vi.setSystemTime("2024-12-25 23:59");
    expect(getDiscount()).toBe(0.2);
  })

  it('should not get discount if is not christmas day', () => {
    vi.setSystemTime("2024-11-24");
    expect(getDiscount()).toBe(0);
  })
})
