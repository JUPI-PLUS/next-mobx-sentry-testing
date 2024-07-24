import { ComponentMeta, ComponentStory } from "@storybook/react";
import Autocomplete from "./Autocomplete";

export default {
    title: "uiKit/Selectors/Autocomplete",
    component: Autocomplete,
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
} as ComponentMeta<typeof Autocomplete>;

type Option = Record<string, string> & { label: string; value: string };

const Template: ComponentStory<typeof Autocomplete<Option>> = args => <Autocomplete {...args} />;

export const Default = Template.bind({});
Default.args = {};
