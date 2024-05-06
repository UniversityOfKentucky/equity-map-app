import PropTypes from 'prop-types';

// Provides a fallback UI when an error occurs in the app
function ErrorFallback({ error, resetErrorBoundary }) {
        return (
         <div role="alert">
             <p>Something went wrong:</p>
             <pre>{error.message}</pre>
                 <button onClick={resetErrorBoundary}>Try again</button>
                </div>
        )
}

ErrorFallback.propTypes = {
    error: PropTypes.object.isRequired,
    resetErrorBoundary: PropTypes.func.isRequired,
};

export default ErrorFallback;

