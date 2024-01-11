import { Route, Routes } from 'react-router-dom';
import StandAloneChat from './StandAloneChat/StandaloneChat';

const ChatRoutes = () => {
  return (
    <Routes>
      <Route path='' element={<StandAloneChat />} />
      <Route path=':conversationId' element={<StandAloneChat />} />
    </Routes>
  );
};

export default ChatRoutes;
