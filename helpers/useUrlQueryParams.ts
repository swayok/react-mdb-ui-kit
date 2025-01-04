import {NavigateOptions, useSearchParams} from 'react-router-dom'
import {AnyObject} from '../types/Common'

type RecordType<KeysOrObject extends string | object> = KeysOrObject extends string
    ? AnyObject<string, KeysOrObject extends string ? KeysOrObject : keyof KeysOrObject>
    : KeysOrObject

type ParamValueType<KeysOrObject extends string | object> = KeysOrObject extends string
    ? string | null
    : Exclude<KeysOrObject[keyof KeysOrObject], undefined> | null

// Generic типы с возможностью задать набор ключей для параметров в URL Query
export interface TypedUrlQueryParams<KeysOrObject extends string | object> extends URLSearchParams {
    append(name: KeysOrObject extends string ? KeysOrObject : keyof KeysOrObject, value: string): void;
    delete(name: KeysOrObject extends string ? KeysOrObject : keyof KeysOrObject): void;
    get(name: KeysOrObject extends string ? KeysOrObject : keyof KeysOrObject): ParamValueType<KeysOrObject>;
    getAll(name: KeysOrObject extends string ? KeysOrObject : keyof KeysOrObject): string[];
    has(name: KeysOrObject extends string ? KeysOrObject : keyof KeysOrObject): boolean;
    set(name: KeysOrObject extends string ? KeysOrObject : keyof KeysOrObject, value: string): void;
    forEach(callbackfn: (
        value: KeysOrObject extends string ? string : KeysOrObject[keyof KeysOrObject],
        key: KeysOrObject extends string ? KeysOrObject : keyof KeysOrObject,
        parent: TypedUrlQueryParams<KeysOrObject extends string ? KeysOrObject : keyof KeysOrObject>) => void,
        thisArg?: unknown
    ): void;
    length: number;
    toRecord(): Partial<RecordType<KeysOrObject>>;
}

export type TypedURLSearchParamsInit<KeysOrObject extends string | object> =
    string
    | [KeysOrObject extends string ? KeysOrObject : keyof KeysOrObject, string]
    | Partial<Record<KeysOrObject extends string ? KeysOrObject : keyof KeysOrObject, string | string[]>>
    | AnyObject<string | string[], KeysOrObject extends string ? KeysOrObject : keyof KeysOrObject>
    | TypedUrlQueryParams<KeysOrObject>

export type SetTypedUrlQueryParams<KeysOrType extends string | object> = (
    nextInit?: TypedURLSearchParamsInit<KeysOrType> | ((prev: TypedUrlQueryParams<KeysOrType>) => TypedURLSearchParamsInit<KeysOrType>),
    navigateOpts?: NavigateOptions
) => void;

// Подмена useSearchParams с добавлением типизации (набора ключей)
export default function useUrlQueryParams<KeysOrObject extends string | object>(
    defaultInit?: TypedURLSearchParamsInit<KeysOrObject>
): [TypedUrlQueryParams<KeysOrObject>, SetTypedUrlQueryParams<KeysOrObject>] {
    // @ts-ignore
    const [params, setParams] = useSearchParams(defaultInit) as [TypedUrlQueryParams<KeysOrObject>, SetTypedUrlQueryParams<KeysOrObject>, number]
    params.length = 0
    params.forEach((): void => {
        params.length++
    })
    params.toRecord = (): Partial<RecordType<KeysOrObject>> => {
        const record: AnyObject<string, String> = {}
        params.forEach((value: string, key: string): void => {
            record[key] = value
        })
        return record as Partial<RecordType<KeysOrObject>>
    }
    return [params, setParams]
}
