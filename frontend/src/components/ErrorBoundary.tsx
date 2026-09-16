import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in SamudraAI React tree:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#FFF570',
          color: '#000000',
          padding: '2rem',
          fontFamily: 'monospace',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            maxWidth: '650px',
            width: '100%',
            border: '3px solid #000000',
            backgroundColor: '#ffffff',
            padding: '2rem',
            boxShadow: '6px 6px 0px 0px #000000'
          }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#000000',
              color: '#FFF570',
              padding: '4px 10px',
              fontWeight: 'bold',
              fontSize: '12px',
              marginBottom: '1rem'
            }}>
              SAMUDRA AI // SYSTEM RECOVERY
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 1rem 0' }}>
              Interface Render Notice
            </h1>
            <p style={{ fontSize: '13px', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              An interface component encountered an error during initialization. The multi-agent cognition pipeline and edge telemetry remain intact.
            </p>
            {this.state.error && (
              <pre style={{
                backgroundColor: '#f4f4f4',
                border: '1px solid #000',
                padding: '1rem',
                fontSize: '11px',
                overflowX: 'auto',
                marginBottom: '1.5rem',
                color: '#b91c1c'
              }}>
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => {
                try { localStorage.clear(); } catch (_) {}
                window.location.reload();
              }}
              style={{
                backgroundColor: '#000000',
                color: '#FFF570',
                border: '2px solid #000000',
                padding: '10px 20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'monospace'
              }}
            >
              RELOAD APPLICATION
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
