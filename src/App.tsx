import React, { useState, useDeferredValue } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useGetFruitsQuery } from './services/fruityViceApi';
import { setGroupBy } from './features/fruits/fruitsSlice';
import {
  addFruitToJar,
  addGroupToJar,
  removeFruitFromJar,
} from './features/jar/jarSlice';
import { RootState } from './store';
import { Fruit } from './types';
import './index.css';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { groupBy } = useSelector((state: RootState) => state.fruits);
  const { selectedFruits } = useSelector((state: RootState) => state.jar);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery); // Defer the search query to avoid blocking UI

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

  function handleRemoveFruitFromJar(fruit: Fruit) {
    dispatch(removeFruitFromJar(fruit));
  }

  function toggleGroup(groupName: string) {
    setExpandedGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((name) => name !== groupName)
        : [...prev, groupName],
    );
  }

  const groupedFruits = groupFruits(fruits, groupBy);

  function filterFruits(groupedFruits: { [key: string]: Fruit[] }) {
    if (deferredSearchQuery.trim() === '') return groupedFruits;

    const query = deferredSearchQuery.toLowerCase();

    return Object.keys(groupedFruits).reduce(
      (acc, groupName) => {
        const filteredGroup = groupedFruits[groupName].filter((fruit) =>
          fruit.name.toLowerCase().includes(query),
        );
        if (filteredGroup.length > 0) {
          acc[groupName] = filteredGroup;
        }
        return acc;
      },
      {} as { [key: string]: Fruit[] },
    );
  }

  const visibleFruits = filterFruits(groupedFruits);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Fruityvice</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">🍎 Fruits</h2>
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a fruit..."
              className="p-2 border border-gray-300 rounded-md w-full mb-4"
            />

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
              {Object.entries(visibleFruits).map(([groupName, fruits]) => (
                <div key={groupName}>
                  {groupBy !== 'None' && (
                    <div className="flex items-baseline mb-2">
                      <h3
                        className="text-lg font-semibold mb-2 mr-2 mt-4 cursor-pointer"
                        onClick={() => toggleGroup(groupName)} // Toggle group
                      >
                        {groupName}{' '}
                        {expandedGroups.includes(groupName) ? '▲' : '▼'}
                      </h3>
                      <button
                        onClick={() => handleAddGroupToJar(fruits)}
                        className="bg-blue-400 text-white px-2 py-1 rounded-md mb-2"
                      >
                        Add Group
                      </button>
                    </div>
                  )}
                  {(groupBy === 'None' ||
                    expandedGroups.includes(groupName)) && (
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
                  )}
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
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 border-b border-gray-200"
                    >
                      <div>
                        {fruit.name} –{' '}
                        <span className="font-semibold text-gray-500">
                          {fruit.nutritions.calories} cal{' '}
                          {quantity > 1 && `(x${quantity})`}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFruitFromJar(fruit)}
                        className="bg-red-500 text-white ml-3 px-2 py-2 rounded-md"
                      >
                        Remove
                      </button>
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
    // Return a flattened array as an ungrouped list
    return { All: fruits };
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
