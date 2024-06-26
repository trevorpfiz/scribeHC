import type { SignInFormProps } from "~/components/auth/signin-form";
import { SignInForm } from "~/components/auth/signin-form";
import { cleanup, fireEvent, render, screen, waitFor } from "~/lib/test-utils";

afterEach(cleanup);

const onSubmitMock: jest.Mock<SignInFormProps["onSubmit"]> = jest.fn();

const defaultProps: SignInFormProps = {
  onSubmit: onSubmitMock,
  isLoading: false,
};

describe("SignInForm", () => {
  it("renders correctly", async () => {
    render(<SignInForm {...defaultProps} />);
    expect(await screen.findByText(/Sign In to scribeHC/i)).toBeOnTheScreen();
  });

  it("should display required error when values are empty", async () => {
    render(<SignInForm {...defaultProps} />);

    const button = screen.getByTestId("signin-button");
    expect(screen.queryByText(/Email is required/i)).not.toBeOnTheScreen();
    fireEvent.press(button);
    expect(await screen.findByText(/Email is required/i)).toBeOnTheScreen();
    expect(screen.getByText(/Password is required/i)).toBeOnTheScreen();
  });

  it("should display matching error when email is invalid", async () => {
    render(<SignInForm {...defaultProps} />);

    const button = screen.getByTestId("signin-button");
    const emailInput = screen.getByTestId("email-input");

    fireEvent.changeText(emailInput, "invalid-email");
    fireEvent.press(button);

    expect(screen.queryByText(/Email is required/i)).not.toBeOnTheScreen();
    expect(await screen.findByText(/Invalid email format/i)).toBeOnTheScreen();
  });

  it("Should call LoginForm with correct values when values are valid", async () => {
    render(<SignInForm {...defaultProps} />);

    const button = screen.getByTestId("signin-button");
    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    fireEvent.changeText(emailInput, "youssef@gmail.com");
    fireEvent.changeText(passwordInput, "password");
    fireEvent.press(button);
    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });
    // undefined because we don't use second argument of the  SubmitHandler
    expect(onSubmitMock).toHaveBeenCalledWith(
      {
        email: "youssef@gmail.com",
        password: "password",
      },
      undefined,
    );
  });

  it("should display loading indicator when isLoading is true", async () => {
    render(<SignInForm {...defaultProps} isLoading={true} />);

    const buttonLoader = screen.getByTestId("signin-button-loading");
    expect(buttonLoader).toBeOnTheScreen();
  });
});
