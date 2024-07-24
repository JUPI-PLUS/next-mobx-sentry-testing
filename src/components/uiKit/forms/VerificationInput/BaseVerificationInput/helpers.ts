// libs
import { createRef } from "react";
import uniqueId from "lodash/uniqueId";

export const generateValues = (value: string, length: number) =>
    new Array(length).fill("").map((_, index) => value[index] ?? "");

export const generateIds = (length: number) => new Array(length).fill(null).map(() => uniqueId());

export const generateRefs = (length: number) => new Array(length).fill(null).map(() => createRef<HTMLInputElement>());
