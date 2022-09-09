import {AVAILABLE_CODES_NAMES, CODES_STATUSES} from "@/constants";

export default function useAppliedCodes(props) {
    return props.cart.custom?.customFieldsRaw
        .filter(field => field.name === AVAILABLE_CODES_NAMES.DISCOUNT_CODES)
        .reduce(customField => customField)
        .value
        .map(code => JSON.parse(code))
        .filter(code => code.status === CODES_STATUSES.APPLIED)
}