// src/types/yup.d.ts
import * as yup from "yup";
import { AnyObject, Maybe } from "yup/lib/types";

declare module "yup" {
    interface StringSchema<
        Type extends Maybe<string> = string | undefined,
        Context extends AnyObject = AnyObject,
        Out extends Type = Type
    > extends yup.BaseSchema<Type, Context, Out> {
        optionalMin(min: number, msg: string): StringSchema<Type, Context>;
        richTextMin(min: number, msg: string): StringSchema<Type, Context>;
        richTextMax(max: number, msg: string): StringSchema<Type, Context>;
        richTextRequired(msg: string): StringSchema<Type, Context>;
        phoneNumberValid(msg: string): StringSchema<Type, Context>;
    }
}

export default yup;
