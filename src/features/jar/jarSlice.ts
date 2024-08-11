import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Fruit } from '../../types';

interface JarState {
  selectedFruits: Fruit[];
  totalCalories: number;
}

const initialState: JarState = {
  selectedFruits: [],
  totalCalories: 0,
};

const jarSlice = createSlice({
  name: 'jar',
  initialState,
  reducers: {
    addFruitToJar(state, action: PayloadAction<Fruit>) {
      state.selectedFruits.push(action.payload);
      state.totalCalories += action.payload.nutritions.calories;
    },
    addGroupToJar(state, action: PayloadAction<Fruit[]>) {
      action.payload.forEach((fruit) => {
        state.selectedFruits.push(fruit);
        state.totalCalories += fruit.nutritions.calories;
      });
    },
  },
});

export const { addFruitToJar, addGroupToJar } = jarSlice.actions;
export default jarSlice.reducer;
