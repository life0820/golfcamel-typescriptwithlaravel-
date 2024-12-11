// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { IFlight } from './types';

// Define a service using base URL and expected endpoints
export const flightApi = createApi({
    reducerPath: 'flightApi',
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8000",
        prepareHeaders: (headers) => {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (csrfToken) {
                headers.set('X-CSRF-TOKEN', csrfToken);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getAirports: builder.query({
            query: (keyword: string) => `/flight/getAirports/${keyword}`,
            // keepUnusedDataFor: 0, // Cache expires immediately
        }),
        getFlightOffers: builder.mutation({
            query: ({ ...patch }) => ({
                url: '/flight/search-flight-offers',
                method: 'POST',
                body: patch
            })
        }),
        getFlightOfferPrice: builder.mutation({
            query: ({ ...patch }) => ({
                url: '/flight/get-flight-offer-price',
                method: 'POST',
                body: patch
            })
        })
    })
})

export const {
    useGetAirportsQuery,
    useGetFlightOffersMutation,
    useGetFlightOfferPriceMutation,
} = flightApi;
