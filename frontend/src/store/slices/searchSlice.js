import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    query: '',
    results: [],
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.query = action.payload.query;
            state.results = action.payload.results;
        },
        clearSearch: (state) => {
            state.query = '';
            state.results = [];
        },
    },
});

export const { setSearchQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
