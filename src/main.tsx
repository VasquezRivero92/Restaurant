import {StrictMode, Component, ReactNode, ErrorInfo} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Captura global de errores no controlados para mostrarlos en consola
window.addEventListener('error', (event) => {
  console.error('[Global Error]', event.error || event.message, event);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]', event.reason, event);
});

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[React Error Boundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', color: '#b91c1c' }}>
          <h2>Se produjo un error en la aplicación</h2>
          <pre style={{ background: '#fef2f2', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: 13 }}>
            {this.state.error?.stack || this.state.error?.message || String(this.state.error)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 12, padding: '8px 16px', cursor: 'pointer', borderRadius: 6, border: '1px solid #dc2626', background: '#dc2626', color: '#fff', fontWeight: 'bold' }}
          >
            Recargar Página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);
