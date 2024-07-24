// libs
import React, { FC, useCallback } from "react";

// models
import { Option, OptionsContainerProps } from "../../models";

// components
import OptionItem from "../OptionItem/OptionItem";

const OptionsContainer: FC<OptionsContainerProps> = ({ items, isDisabled, setItems }) => {
    const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
        setItems(prevItems => {
            const draft = prevItems.slice(0);
            draft.splice(dragIndex, 1);
            draft.splice(hoverIndex, 0, prevItems[dragIndex]);
            return draft;
        });
    }, []);

    const deleteItem = useCallback(
        (index: number) => () => {
            setItems(prevItems => {
                const start = prevItems.slice(0, index);
                const end = prevItems.slice(index + 1);
                return [...start, ...end];
            });
        },
        []
    );

    const onEditOptionSubmit = useCallback(
        (index: number) => (option: Option) => {
            setItems(prevItems => {
                const start = prevItems.slice(0, index);
                const end = prevItems.slice(index + 1);
                return [...start, option, ...end];
            });
        },
        []
    );

    return (
        <div>
            {items.map((item, index) => (
                <OptionItem
                    key={item.id}
                    index={index}
                    item={item}
                    items={items}
                    isDisabled={isDisabled}
                    moveItem={moveItem}
                    onDelete={deleteItem(index)}
                    onEdit={onEditOptionSubmit(index)}
                />
            ))}
        </div>
    );
};

export default OptionsContainer;
