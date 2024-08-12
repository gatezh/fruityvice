import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useGetFruitsQuery } from './services/fruityViceApi';
import { setGroupBy } from './features/fruits/fruitsSlice';
import { addFruitToJar, addGroupToJar } from './features/jar/jarSlice';
import { RootState } from './store';
import { Fruit } from './types';
import './index.css';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { groupBy } = useSelector((state: RootState) => state.fruits);
  const { selectedFruits } = useSelector((state: RootState) => state.jar);

  const { data: fruits = [], error, isLoading } = useGetFruitsQuery();

  function handleGroupByChange(event: React.ChangeEvent<HTMLSelectElement>) {
    dispatch(
      setGroupBy(event.target.value as 'None' | 'Family' | 'Order' | 'Genus'),
    );
  }

  function handleAddFruitToJar(fruit: Fruit) {
    dispatch(addFruitToJar(fruit));
  }

  function handleAddGroupToJar(group: Fruit[]) {
    dispatch(addGroupToJar(group));
  }

  const groupedFruits = groupFruits(fruits, groupBy);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Fruityvice</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">🍎 Fruits</h2>
          <div>
            <div className="flex items-center mb-4">
              <label
                htmlFor="groupBy"
                className="text-gray-700 text-md font-bold mb-2 mr-2"
              >
                Group by:
              </label>
              <select
                id="groupBy"
                value={groupBy}
                onChange={handleGroupByChange}
                className="p-1 border border-gray-300 rounded-md mb-4"
              >
                <option value="None">None</option>
                <option value="Family">Family</option>
                <option value="Order">Order</option>
                <option value="Genus">Genus</option>
              </select>
            </div>

            <div>
              {Object.entries(groupedFruits).map(([groupName, fruits]) => (
                <div key={groupName}>
                  {groupBy !== 'None' && (
                    <div className="flex items-baseline mb-2">
                      <h3 className="text-lg font-semibold mb-2 mr-2 mt-4">
                        {groupName}
                      </h3>
                      <button
                        onClick={() => handleAddGroupToJar(fruits)}
                        className="bg-blue-400 text-white px-2 py-1 rounded-md mb-2"
                      >
                        Add Group
                      </button>
                    </div>
                  )}
                  <ul className="space-y-1">
                    {fruits.map((fruit) => (
                      <li
                        key={fruit.name}
                        className="flex justify-between items-center p-2 border-b border-gray-200"
                      >
                        <div>
                          {fruit.name} –{' '}
                          <span className="font-semibold text-gray-500">
                            {fruit.nutritions.calories} cal
                          </span>
                        </div>
                        <button
                          onClick={() => handleAddFruitToJar(fruit)}
                          className="bg-green-400 text-white px-2 py-1 rounded-md"
                        >
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-md">
          {/* Jar */}
          <div>
            <h2 className="text-2xl font-bold mb-4">🫙 Jar</h2>
            {selectedFruits.length === 0 ? (
              <div>Your jar is empty.</div>
            ) : (
              <div>
                <p className="text-gray-700 text-md font-bold mb-2 mr-2">
                  Total Calories:{' '}
                  {selectedFruits.reduce(
                    (total, { fruit, quantity }) =>
                      total + fruit.nutritions.calories * quantity,
                    0,
                  )}
                </p>

                <ul className="space-y-1">
                  {selectedFruits.map(({ fruit, quantity }, index) => (
                    <li key={index}>
                      {fruit.name} –{' '}
                      <span className="font-semibold text-gray-500">
                        {fruit.nutritions.calories} cal (x{quantity})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function groupFruits(
  fruits: Fruit[],
  groupBy: 'None' | 'Family' | 'Order' | 'Genus',
) {
  if (groupBy === 'None') {
    return { None: fruits };
  }

  return fruits.reduce(
    (groups, fruit) => {
      const key = fruit[groupBy.toLowerCase() as 'family' | 'order' | 'genus'];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(fruit);
      return groups;
    },
    {} as { [key: string]: Fruit[] },
  );
}

export default App;
