import gql from 'graphql-tag';
import useQueryFacade from '../useQueryFacade';
import { useState } from 'react';
const query = gql`
  query shippingMethods(
    $cartId: String!
    $locale: Locale!
  ) {
    shippingMethodsByCart(
      id: $cartId
    ) {
      methodId: id
      name
      localizedDescription(locale: $locale)
      isDefault
      zoneRates {
        shippingRates {
          isMatching
          freeAbove {
            centAmount
          }
          price {
            centAmount
            currencyCode
            fractionDigits
          }
        }
      }
    }
  }
`;

//this is the React api useQuery(query,options)
// https://www.apollographql.com/docs/react/api/react/hooks/#function-signature
const useShippingMethods = ({
  cartId, locale
}) => {
  const [shippingMethods, setShippingMethods] = useState();

  const { loading, error } = useQueryFacade(query, {
    variables: {
      cartId,
      locale,
    },
    onCompleted: (data) => {
      if (!data) {
        return;
      }
      setShippingMethods(data.shippingMethodsByCart);
    },
  });
  return { shippingMethods, loading, error };
};
export default useShippingMethods;
