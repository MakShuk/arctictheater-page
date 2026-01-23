import { useInitializeApp } from './hooks/useInitializeApp';
import { Spinner } from './components/Spinner';
import { Layout } from './components/Layout';
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  const { isLoading } = useInitializeApp();

  return (
    <ThemeProvider>
      {isLoading ? <Spinner /> : <Layout />}
    </ThemeProvider>
  );
}

export default App;
