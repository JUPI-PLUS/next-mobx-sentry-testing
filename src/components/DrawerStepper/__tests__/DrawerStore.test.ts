import { DrawerStepperStore } from "../store";

describe("Drawer store", () => {
	it("Should return default computed values", () => {
		const store = new DrawerStepperStore();

		expect(store.activeStep).toEqual(0);
		expect(store.isSubmitButtonDisabled).toBeFalsy();
		expect(store.submitButtonText).toEqual("");
		expect(store.isStepChanging).toBeFalsy();
		expect(store.isSubmitted).toBeFalsy();
	});
	it("Should increment step by calling goToNextStep", () => {
		const store = new DrawerStepperStore();

		store.goToNextStep();

		expect(store.activeStep).toEqual(1);
		expect(store.isStepChanging).toBeTruthy();
	});
	it("Should decrement step by calling goToPrevStep", () => {
		const store = new DrawerStepperStore();

		store.goToPrevStep();

		expect(store.activeStep).toEqual(-1);
		expect(store.isStepChanging).toBeTruthy();
	});
	it.each([{ expected: true }, { expected: false }])("Should setup _isSubmitButtonDisabled to $expected by calling disableSubmitButton method", ({ expected }) => {
		const store = new DrawerStepperStore();

		store.disableSubmitButton(expected);

		expect(store.isSubmitButtonDisabled).toBe(expected);
	});
	it("Should setup _isSubmitButtonDisabled to false by calling enableSubmitButton method", () => {
		const store = new DrawerStepperStore();

		store.disableSubmitButton(true);

		expect(store.isSubmitButtonDisabled).toBeTruthy();

		store.enableSubmitButton();

		expect(store.isSubmitButtonDisabled).toBeFalsy();
	});
	it("Should setup _submitText by calling setupSubmitButtonText method", () => {
		const MOCKED_SUBMIT_TEXT = "Submit";
		const store = new DrawerStepperStore();

		expect(store.submitButtonText).toEqual("");

		store.setupSubmitButtonText(MOCKED_SUBMIT_TEXT);

		expect(store.submitButtonText).toEqual(MOCKED_SUBMIT_TEXT);
	});
	it.each([{ expected: true }, { expected: false }])("Should setup _isChangingStep to $expected by calling setupIsChangingStep method", ({ expected }) => {
		const store = new DrawerStepperStore();

		store.setupIsChangingStep(expected);

		expect(store.isStepChanging).toBe(expected);
	});
	it("Should setup _isSubmitted to true by calling setupIsSubmitted method", () => {
		const store = new DrawerStepperStore();

		store.setupIsSubmitted();

		expect(store.isSubmitted).toBeTruthy();
	});
	it("Should setup default properties by calling cleanup method", () => {
		const MOCKED_SUBMIT_TEXT = "Submit";
		const store = new DrawerStepperStore();

		store.goToNextStep();
		store.setupSubmitButtonText(MOCKED_SUBMIT_TEXT);
		store.disableSubmitButton(true);

		expect(store.activeStep).toBe(1);
		expect(store.submitButtonText).toBe(MOCKED_SUBMIT_TEXT);
		expect(store.isSubmitButtonDisabled).toBeTruthy();

		store.cleanup();

		expect(store.activeStep).toBe(0);
		expect(store.submitButtonText).toBe("");
		expect(store.isSubmitButtonDisabled).toBeFalsy();
		expect(store.isSubmitted).toBeFalsy();
	});
});