import toast from 'react-hot-toast';

export function getErrorMessage(error, fallbackMessage = 'Something went wrong') {
    if (typeof error === 'string') return error;

    return (
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        fallbackMessage
    );
}

export function handleError(error, fallbackMessage = 'Something went wrong', options = {}) {
    const { logMessage = fallbackMessage, showToast = true } = options;
    const message = getErrorMessage(error, fallbackMessage);

    console.error(logMessage, error);

    if (showToast) {
        toast.error(message);
    }

    return message;
}
