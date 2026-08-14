import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg)",
            padding: 24,
          }}
        >
          <div className="card" style={{ maxWidth: 420, textAlign: "center" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "rgba(239,68,68,0.12)",
                color: "var(--status-error)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
                fontSize: 24,
              }}
            >
              !
            </div>
            <h3 style={{ marginBottom: 8 }}>Something went wrong</h3>
            <p className="text-muted" style={{ fontSize: 14, marginBottom: 20 }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
