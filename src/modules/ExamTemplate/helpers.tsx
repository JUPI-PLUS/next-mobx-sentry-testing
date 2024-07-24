// libs
import uniqueId from "lodash/uniqueId";

// constants
import { DEFAULT_EXAM_TEMPLATE_SOURCE_PARAMS_GROUP } from "./constants";

// models
import { ExamTemplateItemWithId } from "./components/ExamTemplateParameters/models";
import { Parameter } from "../../shared/models/business/parameter";
import { AddEditParamToExamTemplate } from "../../shared/models/business/examTemplate";

// ADD PARAMETER

export const addParameterInGroup = (
    examTemplateArray: ExamTemplateItemWithId[],
    groupUUID: string,
    parameter: Parameter
): ExamTemplateItemWithId[] =>
    examTemplateArray.map(item =>
        item.group_uuid === groupUUID ? { ...item, params: [...(item.params || []), parameter] } : item
    );

export const addParameterInSource = (
    examTemplateArray: ExamTemplateItemWithId[],
    parameter: Parameter
): ExamTemplateItemWithId[] => {
    const examTemplateItemWithSourceParams = examTemplateArray.find(item => !item.group_uuid);
    if (examTemplateItemWithSourceParams) {
        return examTemplateArray.map(item =>
            !item.group_uuid ? { ...item, params: [...(item.params || []), parameter] } : item
        );
    } else {
        return [
            ...examTemplateArray,
            { id: uniqueId("group"), ...DEFAULT_EXAM_TEMPLATE_SOURCE_PARAMS_GROUP, params: [parameter] },
        ];
    }
};

// EDIT PARAMETER

export const editParameterInGroup = (
    examTemplateArray: ExamTemplateItemWithId[],
    groupUUID: string,
    parameter: Parameter
): ExamTemplateItemWithId[] =>
    examTemplateArray.map(item =>
        item.group_uuid === groupUUID
            ? {
                  ...item,
                  params: item.params!.map(param => (param.uuid === parameter.uuid ? parameter : param)),
              }
            : item
    );

export const editParameterInSource = (
    examTemplateArray: ExamTemplateItemWithId[],
    parameter: Parameter
): ExamTemplateItemWithId[] =>
    examTemplateArray.map(item =>
        !item.group_uuid
            ? {
                  ...item,
                  params: item.params!.map(param => (param.uuid === parameter.uuid ? parameter : param)),
              }
            : item
    );

// DELETE PARAMETER

export const deleteParameterInGroup = (
    examTemplateArray: ExamTemplateItemWithId[],
    parentUUID: string,
    itemUUID: string
): ExamTemplateItemWithId[] =>
    examTemplateArray.map(item =>
        item.group_uuid === parentUUID
            ? {
                  ...item,
                  params: item.params!.filter(p => p.uuid !== itemUUID),
              }
            : item
    );

export const deleteParameterInSource = (
    examTemplateArray: ExamTemplateItemWithId[],
    parentUUID: string,
    itemUUID: string
): ExamTemplateItemWithId[] =>
    examTemplateArray.reduce<ExamTemplateItemWithId[]>((acc, item) => {
        if (item.group_uuid) return [...acc, item];
        const updatedParams = item.params!.filter(p => p.uuid !== itemUUID);
        return updatedParams.length
            ? [
                  ...acc,
                  {
                      ...item,
                      params: updatedParams,
                  },
              ]
            : acc;
    }, []);

/*
Picks only parameters from all groups and from source in exam template
*/
export const modifyParametersData = (parameters: AddEditParamToExamTemplate[]): AddEditParamToExamTemplate[] => {
    const allParameters = parameters.reduce<Parameter[]>(
        (acc, { params }) => (params?.length ? [...acc, ...params] : acc),
        []
    );
    return allParameters.length ? [{ ...DEFAULT_EXAM_TEMPLATE_SOURCE_PARAMS_GROUP, params: allParameters }] : [];
};
