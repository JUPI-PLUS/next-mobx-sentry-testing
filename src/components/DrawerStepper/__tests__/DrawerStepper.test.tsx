import { object } from "yup";
import { act, render, screen } from "@testing-library/react";
import DrawerStepper from "../DrawerStepper";
import userEvent from "@testing-library/user-event";
import FormInput from "../../uiKit/forms/Inputs/CommonInput/FormInput";

const MOCKED_FIRST_STEP_CONTENT = "First step content";
const MOCKED_TITLE = "Drawer title";
const FIRST_STEP_COMPONENT = () => {
	return (
		<div>
			<div>{MOCKED_FIRST_STEP_CONTENT}</div>
			<FormInput name="field" />
		</div>
	)
}

const MOCKED_SECOND_STEP_CONTENT = "First step content";
const SECOND_STEP_COMPONENT = () => {
	return (
		<div>{MOCKED_SECOND_STEP_CONTENT}</div>
	)
}

const MOCKED_STEPS = [
	{
		backText: "Back",
		saveText: "Next",
		schema: object(),
		defaultValues: {},
	},
	{
		backText: "Back",
		saveText: "Save",
		schema: object(),
		defaultValues: {},
	},
];

const MOCKED_ON_SUBMIT_CALLBACK = jest.fn().mockResolvedValue({});
const MOCKED_ON_OPTIONAL_CALLBACK = jest.fn();
const MOCKED_ON_CLOSE_CALLBACK = jest.fn();
const MOCKED_ON_CANCEL_CALLBACK = jest.fn();
const MOCKED_CANCEL_TEXT = "Cancel";

const setup = (isOpen = true) => {
	render(
		<DrawerStepper
			isOpen={isOpen}
			onSubmit={MOCKED_ON_SUBMIT_CALLBACK}
			onOptional={MOCKED_ON_OPTIONAL_CALLBACK}
			onClose={MOCKED_ON_CLOSE_CALLBACK}
			onCancel={MOCKED_ON_CANCEL_CALLBACK}
			steps={MOCKED_STEPS}
			cancelText={MOCKED_CANCEL_TEXT}
			title={MOCKED_TITLE}
		>
			<FIRST_STEP_COMPONENT />
			<SECOND_STEP_COMPONENT />
		</DrawerStepper>
	)
}

describe("DrawerStepper component", () => {
	it("Should render without errors", async () => {
		await act(async () => {
			setup();
		});

		expect(screen.getByText(MOCKED_TITLE)).toBeInTheDocument();
		expect(screen.getByText(MOCKED_STEPS[0].saveText)).toBeInTheDocument();
		expect(screen.getByText(MOCKED_FIRST_STEP_CONTENT)).toBeInTheDocument();
		expect(screen.getByText(MOCKED_CANCEL_TEXT)).toBeInTheDocument();
	});
	it("Should not render drawer if isOpen was provided as false", async () => {
		await act(async () => {
			setup(false);
		});

		expect(screen.queryByText(MOCKED_TITLE)).not.toBeInTheDocument();
		expect(screen.queryByText(MOCKED_STEPS[0].saveText)).not.toBeInTheDocument();
		expect(screen.queryByText(MOCKED_FIRST_STEP_CONTENT)).not.toBeInTheDocument();
	})
	it("Should call onSubmit callback by clicking on submit drawer", async () => {
		await act(async () => {
			setup();
		});

		await act(() => {
			userEvent.click(screen.getByText(MOCKED_STEPS[0].saveText));
		});

		expect(MOCKED_ON_SUBMIT_CALLBACK).toHaveBeenCalled();
	});
	it("Should call onCancel callback by clicking on cancel drawer", async () => {
		await act(async () => {
			setup();
		});

		await act(() => {
			userEvent.click(screen.getByText(MOCKED_CANCEL_TEXT));
		});

		expect(MOCKED_ON_CANCEL_CALLBACK).toHaveBeenCalled();
	});
	it("Should call onOptional callback by clicking on optional button", async () => {
		await act(async () => {
			setup();
		});

		act(() => {
			userEvent.click(screen.getByText(MOCKED_STEPS[0].backText));
		});

		expect(MOCKED_ON_OPTIONAL_CALLBACK).toHaveBeenCalled();
	});
})