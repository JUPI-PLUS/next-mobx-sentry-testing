import { Component, ErrorInfo, PropsWithChildren } from "react";
import { ErrorBoundaryState } from "./models";

export default class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
    };

    public static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // eslint-disable-next-line no-console
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        const { hasError } = this.state;
        const { children } = this.props;

        if (hasError) {
            return <h1>Sorry.. there was an error</h1>;
        }

        return children;
    }
}
