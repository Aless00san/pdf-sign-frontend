import { Component, type ReactNode } from "react";

class PdfErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError)
      return <div>Error loading PDF, please try again.</div>;
    //reload page
    
    return this.props.children;
  }
}

export default PdfErrorBoundary;
