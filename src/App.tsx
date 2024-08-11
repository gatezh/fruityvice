import React from 'react';
import { useGetFruitsQuery } from './services/fruityViceApi';

const App: React.FC = () => {
  const { data: fruits, error, isLoading } = useGetFruitsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return (
    <div className="App">
      <h1>Fruity Vice</h1>
      <ul>
        {fruits?.map((fruit: any) => (
          <li key={fruit.name}>
            {fruit.name} ({fruit.nutritions.calories} calories)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
