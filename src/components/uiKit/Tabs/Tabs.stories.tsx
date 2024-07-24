import { ComponentMeta, ComponentStory } from "@storybook/react";
import Tabs from "./Tabs/Tabs";
import React from "react";
import TabPanel from "./components/TabPanel/TabPanel";

export default {
    title: "uiKit/Tabs",
    component: Tabs,
    argTypes: {},
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = () => {
    const tabs = [
        {
            label: "Tab one",
        },
        {
            label: "Tab two",
        },
        {
            label: "Tab three",
        },
    ];

    return (
        <Tabs tabs={tabs}>
            <TabPanel>
                <div>
                    <h3>Tab one</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, at dicta distinctio dolores
                        laboriosam maiores neque, nisi quam quasi qui quibusdam quidem quo quod repellat saepe sit
                        suscipit totam vitae.
                    </p>
                </div>
            </TabPanel>
            <TabPanel>
                <div>
                    <h3>Tab two</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, at dicta distinctio dolores
                        laboriosam maiores neque, nisi quam quasi qui quibusdam quidem quo quod repellat saepe sit
                        suscipit totam vitae.
                    </p>
                </div>
            </TabPanel>
            <TabPanel>
                <div>
                    <h3>Tab three</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, at dicta distinctio dolores
                        laboriosam maiores neque, nisi quam quasi qui quibusdam quidem quo quod repellat saepe sit
                        suscipit totam vitae.
                    </p>
                </div>
            </TabPanel>
        </Tabs>
    );
};

export const Default = Template.bind({});
Default.args = {};
