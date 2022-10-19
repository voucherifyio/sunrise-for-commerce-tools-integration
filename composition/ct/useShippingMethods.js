import gql from 'graphql-tag';
import useQueryFacade from '../useQueryFacade';
import { useState } from 'react';
const query = gql`
  query shippingMethods(
    $cartId: String!
    $locale: Locale!
  ) {
    shippingMethodsByCart(id: $cartId) {
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
const useShippingMethods = ({ cartId, locale }) => {
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
      const sortShippingMethods = (shippingMethods) => {
        const shippingMethodsWithAveragePrice =
          shippingMethods.map((shippingMethod) => {
            let totalPrice = 0;
            let numberOfZoneRates = 0;
            for (const zoneRate of shippingMethod.zoneRates) {
              for (const shippingRate of zoneRate.shippingRates) {
                if (
                  shippingRate.price.centAmount &&
                  shippingRate.price.fractionDigits
                ) {
                  totalPrice +=
                    shippingRate.price.centAmount /
                    10 ** shippingRate.price.fractionDigits;
                  numberOfZoneRates++;
                }
              }
            }
            return {
              price:
                numberOfZoneRates > 0
                  ? totalPrice / numberOfZoneRates
                  : 0,
              shippingMethod,
            };
          });
        return shippingMethodsWithAveragePrice
          .sort(
            (
              shippingMethodsWithAveragePrice1,
              shippingMethodsWithAveragePrice2
            ) =>
              shippingMethodsWithAveragePrice1.price -
              shippingMethodsWithAveragePrice2.price
          )
          .map(
            (shippingMethodsWithAveragePrice) =>
              shippingMethodsWithAveragePrice.shippingMethod
          );
      };
      sortShippingMethods(data.shippingMethodsByCart);
      setShippingMethods(
        sortShippingMethods(data.shippingMethodsByCart)
      );
    },
    fetchPolicy: 'network-only',
  });
  return { shippingMethods, loading, error };
};
export default useShippingMethods;
