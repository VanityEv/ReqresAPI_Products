import './App.css';
import Main from './pages/Main';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Routes } from 'react-router-dom';

//Client config for React-Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path='/' element={<Main/>}/>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
