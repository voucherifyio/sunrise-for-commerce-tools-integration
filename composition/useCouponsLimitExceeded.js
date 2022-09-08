import useAppliedCodes from "hooks/useAppliedCodes";

export default function useCouponsLimitExceeded(props) {
    const couponLimit = props.cart.custom.customFieldsRaw.find(field => field.name === 'couponsLimit')
    const appliedCodes = useAppliedCodes(props)

    return appliedCodes.length >= (couponLimit?.value ?? 5);
}