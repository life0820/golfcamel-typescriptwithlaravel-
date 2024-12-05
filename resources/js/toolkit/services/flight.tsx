// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { IFlight } from './types';

// Define a service using base URL and expected endpoints
export const flightApi = createApi({
    reducerPath: 'flightApi',
    baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:8000" }),
    endpoints: (builder) => ({
        getAirports: builder.query({
            query: () => '/flight/getAirports',
        })
    })
})

export const {
    useGetAirportsQuery
} = flightApi;
