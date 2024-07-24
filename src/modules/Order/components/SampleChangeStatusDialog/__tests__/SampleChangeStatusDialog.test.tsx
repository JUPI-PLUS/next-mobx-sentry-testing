import { render, screen } from "@testing-library/react";
import SampleDetachExamsDialog from "../SampleChangeStatusDialog";
import { SampleActionType } from "../../../../../shared/models/business/sample";
import userEvent from "@testing-library/user-event";

const MOCKED_SAMPLE_ACTION_TYPE = jest.fn();
const MOCKED_RESET_ORDER_EXAMS = jest.fn();
const MOCKED_RESET_SAMPLE_ACTION_TYPE = jest.fn();
const MOCKED_RESET_IS_SINGLE_ITEM_ACTION = jest.fn();

const MOCKED_ON_SUBMIT_CALLBACK = jest.fn();

jest.mock("../../../store", () => ({
	useOrderStore() {
		return {
			orderStore: {
				sampleActionType: MOCKED_SAMPLE_ACTION_TYPE(),
				resetOrderExams: MOCKED_RESET_ORDER_EXAMS,
				resetSampleActionType: MOCKED_RESET_SAMPLE_ACTION_TYPE,
				resetIsSingleItemAction: MOCKED_RESET_IS_SINGLE_ITEM_ACTION
			}
		};
	}
}));

const setup = () => {
	render(<SampleDetachExamsDialog onSubmit={MOCKED_ON_SUBMIT_CALLBACK} />);
};

describe("SampleChangeStatusDialog component", () => {
	beforeEach(() => {
		MOCKED_SAMPLE_ACTION_TYPE.mockReturnValue(SampleActionType.DetachExams);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Should render component without errors", () => {
		setup();

		expect(screen.getByText("Delete sample?")).toBeInTheDocument();
		expect(screen.getByTestId("submit-dialog-button")).toBeInTheDocument();
		expect(screen.getByTestId("cancel-dialog-button")).toBeInTheDocument();
	});
	it("Should not render dialog if sampling action type is DetachExams", () => {
		MOCKED_SAMPLE_ACTION_TYPE.mockReturnValue(SampleActionType.PrintSample);
		setup();

		expect(screen.queryByText("Delete sample?")).not.toBeInTheDocument();
		expect(screen.queryByTestId("submit-dialog-button")).not.toBeInTheDocument();
		expect(screen.queryByTestId("cancel-dialog-button")).not.toBeInTheDocument();
	});
	it("Should call onSubmit callback on submit dialog", () => {
		setup();

		userEvent.click(screen.getByTestId("submit-dialog-button"));

		expect(MOCKED_ON_SUBMIT_CALLBACK).toHaveBeenCalled();
	});
	it("Should call resetOrderExams, resetSampleActionType, resetIsSingleItemAction from store on close dialog", () => {
		setup();

		userEvent.click(screen.getByTestId("cancel-dialog-button"));

		expect(MOCKED_ON_SUBMIT_CALLBACK).not.toHaveBeenCalled();
		expect(MOCKED_RESET_ORDER_EXAMS).toHaveBeenCalled();
		expect(MOCKED_RESET_SAMPLE_ACTION_TYPE).toHaveBeenCalled();
		expect(MOCKED_RESET_IS_SINGLE_ITEM_ACTION).toHaveBeenCalled();
	});
});