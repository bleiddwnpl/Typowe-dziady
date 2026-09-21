import { Component } from "react";

// Łapie błędy w komponentach poniżej i pokazuje komunikat zamiast białego ekranu.
// inline = komunikat w miejscu jednej zakładki; bez inline = cały ekran.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Błąd aplikacji:", error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    const button = {
      padding: "12px 20px", background: "linear-gradient(135deg,#0051cc,#007aff)", border: "none",
      borderRadius: 14, color: "#fff", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer",
    };

    if (this.props.inline) {
      return (
        <div style={{ textAlign: "center", padding: "40px 16px" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>⚠️</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Ta zakładka się nie wczytała</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 18, lineHeight: 1.5 }}>
            Pozostałe zakładki działają normalnie. Spróbuj ponownie albo odśwież stronę.
          </div>
          <button style={button} onClick={() => this.setState({ error: null })}>Spróbuj ponownie</button>
        </div>
      );
    }

    return (
      <div style={{ minHeight: "100vh", background: "#060a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Inter',sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: 320 }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>⚽</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Coś poszło nie tak</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginBottom: 22, lineHeight: 1.5 }}>
            Twoje typy są bezpieczne. Odśwież stronę, a jeśli problem wróci, daj znać adminowi.
          </div>
          <button style={button} onClick={() => window.location.reload()}>Odśwież stronę</button>
        </div>
      </div>
    );
  }
}
