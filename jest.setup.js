import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import MOCKED_LOCAL_STORAGE from './src/testingInfrustructure/mocks';

Object.defineProperty(global.window, "localStorage", {
    value: MOCKED_LOCAL_STORAGE,
});

jest.mock("next/link", () => {
    return ({children}) => {
        return children;
    }
});
