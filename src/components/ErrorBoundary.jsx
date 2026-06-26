import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          style={{ background: 'linear-gradient(180deg, #F0C4C9 0%, #EDC4B3 50%, #FAF8F5 100%)' }}
        >
          <div className="text-5xl mb-6">🌙</div>
          <h1
            className="text-2xl font-display mb-3"
            style={{ color: '#2D2226' }}
          >
            Oups, un petit souci
          </h1>
          <p
            className="text-sm font-body mb-8 max-w-xs"
            style={{ color: '#4A3F43' }}
          >
            Quelque chose n'a pas fonctionné comme prévu. Pas d'inquiétude, tes données sont en sécurité.
          </p>
          <button
            onClick={this.handleReload}
            className="px-8 py-3 rounded-full font-body font-semibold text-white transition-transform active:scale-95"
            style={{ background: '#C4727F' }}
          >
            Revenir à l'accueil
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
