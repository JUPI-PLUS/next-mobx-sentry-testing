import { Selector, t } from "testcafe";
import { CreateOrder } from "../../../src/modules/CreateOrder/models";
import { ExaminationTemplate } from "../../../src/shared/models/business/examTemplate";
import ToastModel from "../../components/Toast/ToastModel";

export class CreateOrderModel {
    addNoteButton: Selector = Selector("p").withAttribute("data-testid", "addNote");
    referralDoctorInput: Selector = Selector("#referral_doctor");
    referralNotesTextArea: Selector = Selector("#referral_notes");
    saveReferralNotesButton: Selector = Selector("button").withAttribute("data-testid", "saveReferralNotes");
    createOrderSubmitButton: Selector = Selector("button").withAttribute("data-testid", "createOrderSubmitBtn");

    examCheckbox(uuid: string) {
        return Selector("input", { timeout: 100 }).withAttribute("data-testid", `examinationListItem-${uuid}`);
    }

    async tapCheckbox(uuid: string) {
        await t.click(this.examCheckbox(uuid));
    }

    async fillForm(name: CreateOrder["referral_doctor"]) {
        await t.typeText(this.referralDoctorInput, name);
    }

    async submitForm() {
        await t.click(this.createOrderSubmitButton);
    }

    async fillExpandedForm({ referral_doctor, referral_notes, kit_templates }: Partial<CreateOrder>) {
        referral_doctor && (await this.fillForm(referral_doctor));
        kit_templates?.[0].uuid && (await this.tapCheckbox(kit_templates[0].uuid));
        referral_notes && (await t.click(this.addNoteButton).typeText(this.referralNotesTextArea, referral_notes));
    }

    async createPatientOrder(examination: ExaminationTemplate) {
        await this.fillExpandedForm({
            kit_templates: [{ uuid: examination.uuid, exam_templates: [] }],
            referral_doctor: "Doc name",
            referral_notes: "Notes",
        });

        const doctorValue = (await this.referralDoctorInput.value) ?? "";
        const notesValue = (await this.referralNotesTextArea.value) ?? "";

        await t.expect(this.examCheckbox(examination.uuid).checked).ok();
        await t.expect(doctorValue.length).gt(0);
        await t.expect(notesValue.length).gt(0);
        await t.click(this.saveReferralNotesButton);

        await this.submitForm();

        await ToastModel.expectedToastTitle("Order has been successfully created");
        await ToastModel.closeToast();
    }
}

export default new CreateOrderModel();
