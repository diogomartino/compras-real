import { useSelector } from 'react-redux';
import { appLoadingSelector } from './selectors';

export const useIsAppLoading = () => useSelector(appLoadingSelector);
