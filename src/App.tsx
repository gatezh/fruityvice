import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useGetFruitsQuery } from './services/fruityViceApi';
import { setGroupBy } from './features/fruits/fruitsSlice';
import { addFruitToJar, addGroupToJar } from './features/jar/jarSlice';
import { RootState } from './store';

import { Fruit } from './types';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { groupBy } = useSelector((state: RootState) => state.fruits);
  const { selectedFruits } = useSelector((state: RootState) => state.jar);

  const { data: fruits = [], error, isLoading } = useGetFruitsQuery();

  function handleGroupByChange (event: React.ChangeEvent<HTMLSelectElement>) {
    dispatch(setGroupBy(event.target.value as 'None' | 'Family' | 'Order' | 'Genus'));
  }

  function handleAddFruitToJar (fruit: Fruit) {
    dispatch(addFruitToJar(fruit));
  }

  function handleAddGroupToJar (group: Fruit[]) {
    dispatch(addGroupToJar(group));
  }

  const groupedFruits = groupFruits(fruits, groupBy);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return (
    <div className="App">
      <h1>Fruity Vice</h1>

      <h2>Fruits</h2>
      <div>
        <label htmlFor="groupBy">Group by:</label>
        <select id="groupBy" value={groupBy} onChange={handleGroupByChange}>
          <option value="None">None</option>
          <option value="Family">Family</option>
          <option value="Order">Order</option>
          <option value="Genus">Genus</option>
        </select>
      </div>

      {Object.entries(groupedFruits).map(([groupName, fruits]) => (
        <div key={groupName}>
          {groupBy !== 'None' && (
            <>
              <h3>{groupName}</h3>
              <button onClick={() => handleAddGroupToJar(fruits)}>Add Group</button>
          </>)}
            <ul>
              {fruits.map(fruit => (
                <li key={fruit.name}>
                  {fruit.name} ({fruit.nutritions.calories} calories)
                  <button onClick={() => handleAddFruitToJar(fruit)}>Add</button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Jar */}
        <div>
          <h2>Jar</h2>
          <p>Total Calories: {selectedFruits.reduce((total, fruit) => total + fruit.nutritions.calories, 0)}</p>

          <ul>
            {selectedFruits.map((fruit, index) => (
              <li key={index}>
                {fruit.name} ({fruit.nutritions.calories} calories)
              </li>
            ))}
          </ul>

        </div>
    </div>
  );
};

function groupFruits (fruits: Fruit[], groupBy: 'None' | 'Family' | 'Order' | 'Genus') {
  if (groupBy === 'None') {
    return { None: fruits };
  }

  return fruits.reduce((groups, fruit) => {
    const key = fruit[groupBy.toLowerCase() as 'family' | 'order' | 'genus'];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(fruit);
    return groups;
  }, {} as { [key: string]: Fruit[] });
};

export default App;
