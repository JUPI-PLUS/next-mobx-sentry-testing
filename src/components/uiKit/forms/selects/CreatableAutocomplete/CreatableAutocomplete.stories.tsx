import { ComponentMeta, ComponentStory } from "@storybook/react";
import CreatableAutocomplete from "./CreatableAutocomplete";

export default {
    title: "uiKit/Selectors/CreatableAutocomplete",
    component: CreatableAutocomplete,
    argTypes: {
        name: {
            table: {
                disable: true,
            },
        },
        loadOptions: {
            defaultValue: () =>
                new Promise(resolve =>
                    setTimeout(
                        () =>
                            resolve([
                                {
                                    label: "D",
                                    value: "d",
                                },
                                {
                                    label: "E",
                                    value: "e",
                                },
                                {
                                    label: "F",
                                    value: "f",
                                },
                            ]),
                        1500
                    )
                ),
            table: {
                disable: true,
            },
        },
    },
} as ComponentMeta<typeof CreatableAutocomplete>;

type Option = Record<string, string> & { label: string; value: string };

const Template: ComponentStory<typeof CreatableAutocomplete<Option>> = args => <CreatableAutocomplete {...args} />;

export const Default = Template.bind({});
Default.args = {};
