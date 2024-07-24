import UserDetailsCard from "./UserDetailsCard";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
    title: "uiKit/UserDetailsCard",
    component: UserDetailsCard,
    argTypes: {
        firstName: {
            defaultValue: "Marvin",
        },
        lastName: {
            defaultValue: "McKinney",
        },
        birthday: {
            defaultValue: 1441221321323,
        },
        avatar: {
            defaultValue: "",
            table: {
                disabled: true,
            },
        },
        uuid: {
            defaultValue: "9956382",
        },
        variant: {
            defaultValue: "info",
        },
    },
} as ComponentMeta<typeof UserDetailsCard>;

const Template: ComponentStory<typeof UserDetailsCard> = args => <UserDetailsCard {...args} />;

export const Default = Template.bind({});
Default.args = {};
