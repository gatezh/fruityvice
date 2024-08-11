import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Fruit } from '../../types';

interface FruitsState {
  fruits: Fruit[];
  groupBy: 'None' | 'Family' | 'Order' | 'Genus';
}

const initialState: FruitsState = {
  fruits: [],
  groupBy: 'None',
};

const fruitsSlice = createSlice({
  name: 'fruits',
  initialState,
  reducers: {
    setFruits(state, action: PayloadAction<Fruit[]>) {
      state.fruits = action.payload;
    },
    setGroupBy(state, action: PayloadAction<'None' | 'Family' | 'Order' | 'Genus'>) {
      state.groupBy = action.payload;
    },
  },
});

export const { setFruits, setGroupBy } = fruitsSlice.actions;
export default fruitsSlice.reducer;
