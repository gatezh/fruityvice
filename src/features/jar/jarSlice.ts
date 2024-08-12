import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Fruit } from '../../types';

interface JarState {
  selectedFruits: { fruit: Fruit; quantity: number }[];
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
      const alreadyAddedFruit = state.selectedFruits.find(
        (item) => item.fruit.name === action.payload.name,
      );

      if (alreadyAddedFruit) {
        alreadyAddedFruit.quantity += 1;
      } else {
        state.selectedFruits.push({ fruit: action.payload, quantity: 1 });
      }

      state.totalCalories += action.payload.nutritions.calories;
    },

    addGroupToJar(state, action: PayloadAction<Fruit[]>) {
      action.payload.forEach((fruit) => {
        const alreadyAddedFruit = state.selectedFruits.find(
          (item) => item.fruit.name === fruit.name,
        );

        if (alreadyAddedFruit) {
          alreadyAddedFruit.quantity += 1;
        } else {
          state.selectedFruits.push({ fruit, quantity: 1 });
        }

        state.totalCalories += fruit.nutritions.calories;
      });
    },
  },
});

export const { addFruitToJar, addGroupToJar } = jarSlice.actions;
export default jarSlice.reducer;
