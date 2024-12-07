import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App';
import NotFound from './NotFound';

const Router = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/snake1" element={<App p="1" />} />
                <Route path="/snake2" element={<App p="2" />} />
                <Route path="*" element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;