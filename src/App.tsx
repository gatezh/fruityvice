import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useGetFruitsQuery } from './services/fruityViceApi';
import { setGroupBy } from './features/fruits/fruitsSlice';
import { RootState } from './store';

import { Fruit } from './types';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { groupBy } = useSelector((state: RootState) => state.fruits);

  const { data: fruits = [], error, isLoading } = useGetFruitsQuery();
  const groupedFruits = groupFruits(fruits, groupBy);

  function handleGroupByChange (event: React.ChangeEvent<HTMLSelectElement>) {
    dispatch(setGroupBy(event.target.value as 'None' | 'Family' | 'Order' | 'Genus'));
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return (
    <div className="App">
      <h1>Fruity Vice</h1>

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
          {groupBy !== 'None' && <h3>{groupName}</h3>}
            <ul>
              {fruits.map(fruit => (
                <li key={fruit.name}>
                  {fruit.name} ({fruit.nutritions.calories} calories)
                </li>
              ))}
            </ul>
          </div>
        ))}
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
