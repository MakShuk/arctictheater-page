import { Layout } from './components/Layout';
import { Spinner } from './components/Spinner';
import { ThemeProvider } from './components/ThemeProvider';
import { useInitializeApp } from './hooks/useInitializeApp';

function App() {
  const { isLoading } = useInitializeApp();

  return <ThemeProvider>{isLoading ? <Spinner /> : <Layout />}</ThemeProvider>;
}

export default App;
