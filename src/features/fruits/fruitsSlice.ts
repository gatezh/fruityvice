import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Fruit } from '../../types';

interface FruitsState {
  groupBy: 'None' | 'Family' | 'Order' | 'Genus';
}

const initialState: FruitsState = {
  groupBy: 'None',
};

const fruitsSlice = createSlice({
  name: 'fruits',
  initialState,
  reducers: {
    setGroupBy(state, action: PayloadAction<'None' | 'Family' | 'Order' | 'Genus'>) {
      state.groupBy = action.payload;
    },
  },
});

export const { setGroupBy } = fruitsSlice.actions;
export default fruitsSlice.reducer;
